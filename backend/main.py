import textwrap
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain import PromptTemplate

import requests
import os
from youtube_transcript_api import YouTubeTranscriptApi
from typing import TypedDict

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import YoutubeLoader
from langchain.llms import GPT4All
from langchain.chains.summarize import load_summarize_chain
from langchain.docstore.document import Document

from transformers import AutoTokenizer, AutoModelForCausalLM
import transformers
import torch


# FLOWISE_API_KEY: str = os.getenv("FLOWISE_API_KEY")
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
API_URL = "http://localhost:3000/api/v1/prediction/08251153-caae-41e7-be83-fd294358e304"
    
API_URL = "https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6b"
headers = {"Authorization": "Bearer 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"}

class StudentData(TypedDict):
    text: str
    start: float
    duration: float

# headers = {"Authorization": "Bearer " + FLOWISE_API_KEY}
app = FastAPI()
# CORS configuration
origins = [
    "https://www.youtube.com",
    "chrome-extension://dneafihlnpeeamgniakaihmljijohlob",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# def query(payload):
#     response = requests.post(API_URL, headers=headers, json=payload)
#     return response.json()

# @app.get("/")
# async def root():
#     return query({
#     "question": "USA",
# })

def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()

def getText(video_id: str, start_time: int = None, end_time: int = None):
    transcript: list[StudentData] = YouTubeTranscriptApi.get_transcript(video_id)
    if start_time and end_time: # format 2
        # handle edge cases
        if start_time > int(transcript[-1]["start"]) + int(transcript[-1]["duration"]) or start_time < 0:
            return "Error: start_time is out of range"
        elif end_time < int(transcript[0]["start"]) or end_time > int(transcript[-1]["start"]) + int(transcript[-1]["duration"]):
            return {"type": "error", "text": "Error: end_time is out of range"}
        elif start_time > end_time:
            return {"type": "error", "text": "Error: start_time is greater than end_time"}
        elif start_time == end_time:
            return {"type": "error", "text": "Error: start_time is equal to end_time"}
            
        text = ""
        for line in transcript:
            from_time = int(line["start"])
            to_time = from_time + int(line["duration"])
            # if interval touches the line
            if (start_time <= from_time and end_time >= from_time) or (start_time <= to_time and end_time >= to_time):
                text += line["text"].replace("\n", " ")
            elif to_time > end_time: # if interval is after the line
                return {"type": "snip", "text": text}
    else: # format 1
        text = " ".join([line["text"].replace("\n", " ") for line in transcript])
        return {"type": "full", "text": text}

"""
given a youtube video_id, return the video's summary. There are 2 different formats for the summary:
1. just the text of the whole summary
2. summary of specific time intervals, with that, we need to pass the start and end time of the interval
"""
@app.get("/summary_openAI/{video_id}")
async def summary_openAI(video_id: str, start_time: int = None, end_time: int = None):
    # loader = YoutubeLoader.from_youtube_url(f"https://www.youtube.com/watch?v={video_id}", add_video_info=True)
    # transcript = loader.load()
        
    text = getText(video_id, start_time, end_time)
            
    llm = OpenAI(temperature=0, openai_api_key=OPENAI_API_KEY)
    chain = load_summarize_chain(llm, chain_type="map_reduce", verbose=False)
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)

    # langchain bug temp fix to make .run() work
    texts = text_splitter.split_documents([Document(page_content=text, metadata={"video_id": video_id})])
    print(texts)

    summary = chain.run(texts)
    
    print(summary)
    return {"summary": summary}

@app.get("/summary/{video_id}")
async def summary(video_id: str, start_time: int = None, end_time: int = None):
    # loader = YoutubeLoader.from_youtube_url(f"https://www.youtube.com/watch?v={video_id}", add_video_info=True)
    # transcript = loader.load()

    # set up model
    model_path = "./ggml-gpt4all-j-v1.3-groovy.bin"
    llm = GPT4All(model=model_path, verbose=True)

    res = getText(video_id, start_time, end_time)
    
    # handle different types of responses
    if res["type"] == "error":
        return res["text"]
    elif res["type"] == "snip": # format 2
        text = res["text"]
        prompt_template = """Write a concise title that summarizes this text in 1-2 sentences.
{text}

CONCISE SUMMARIZED TITLE FROM TEXT:"""

        BULLET_POINT_PROMPT = PromptTemplate(template=prompt_template,
                        input_variables=["text"])
        chain = load_summarize_chain(llm, chain_type="stuff", verbose=True, prompt=BULLET_POINT_PROMPT)
        text_document = [Document(page_content=text, metadata={"video_id": video_id})]

    elif res["type"] == "full": # format 1
        text = res["text"]
        chain = load_summarize_chain(llm, chain_type="map_reduce", verbose=True)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
        text_document = text_splitter.split_documents([Document(page_content=text, metadata={"video_id": video_id})])
        

    print(text_document)

    summary = chain.run(text_document)
    
    wrapped_summary = textwrap.fill(summary, width=100)
    
    print(summary)
    return {"summary": wrapped_summary}

"""
same as summary, but using HuggingFace
"""
@app.get("/summary_HG/{video_id}")
async def summary_HG(video_id: str, start_time: int = None, end_time: int = None):
    
    # text = getText(video_id, start_time, end_time)
	
    output = query({
	"inputs": "Can you please let us know more details about your ",
    })
    
    return {"summary": output}
    