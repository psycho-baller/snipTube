from  base64 import b64decode
import textwrap
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain import PromptTemplate
from math import ceil

import requests
import os
# from youtube_transcript_api import YouTubeTranscriptApi
from typing import TypedDict

from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.document_loaders import YoutubeLoader
from langchain.llms import GPT4All, Cohere, HuggingFaceHub
from langchain.chains.summarize import load_summarize_chain
from langchain.docstore.document import Document

from prompts import full_summary_template, snip_summary_template_with_context, snip_summary_template

# from transformers import AutoTokenizer, AutoModelForCausalLM
# import transformers
# import torch


# FLOWISE_API_KEY: str = os.getenv("FLOWISE_API_KEY")
# OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
# COHERE_API_KEY: str = os.getenv("COHERE_API_KEY")
HUGGINGFACE_API_KEY: str = os.getenv("HUGGINGFACE_API_KEY")
# API_URL = "http://localhost:3000/api/v1/prediction/08251153-caae-41e7-be83-fd294358e304"
    
# API_URL = "https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6b"
# headers = {"Authorization": "Bearer " + HUGGINGFACE_API_KEY}

class StudentData(TypedDict):
    text: str
    start: float
    duration: float

# headers = {"Authorization": "Bearer " + FLOWISE_API_KEY}
app = FastAPI(docs_url="/api/docs", openapi_url="/openapi.json")

@app.get("/api/healthchecker")
def healthchecker():
    return {"status": "success", "message": "Integrate FastAPI Framework with Next.js and chrome extension successfully!"}

# CORS configuration
origins = [
    "https://www.youtube.com",
    # "chrome-extension://pifbgdkhjhmflojngfjmbpmihbbecfnn",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["application/json"],
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

@app.get("/transcript/{video_id}")
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

@app.get("/api/summary")
async def summary(title: str, transcript: str, summary: str = None, encoded: bool = True):
    # loader = YoutubeLoader.from_youtube_url(f"https://www.youtube.com/watch?v={video_id}", add_video_info=True)
    # transcript = loader.load()

    # set up model
    model_path = "./ggml-gpt4all-j-v1.3-groovy.bin"
    # llm = OpenLLM(server_url='http://localhost:3000', llm_kwargs={"temperature": 0.1})
    # llm = GPT4All(model=model_path, temp=0.1)
    
    # llm = Cohere(model="summarize-xlarge", cohere_api_key=COHERE_API_KEY, temperature=0.1)
    if encoded:
        # decode title and transcript from base64
        title = b64decode(title).decode("utf-8")
        text = b64decode(transcript).decode("utf-8")
        summary = b64decode(summary).decode("utf-8") if summary else None
    else:
        text = transcript #b64decode(transcript).decode("utf-8")

    # res = getText(video_id, start_time, end_time)
    
    # handle different types of responses
    # if res["type"] == "error":
    #     return res["text"]
    # elif res["type"] == "snip": # format 2
    #     text = res["text"]
    if summary: # format 2
        llm = HuggingFaceHub(repo_id="tiiuae/falcon-7b-instruct", model_kwargs={"temperature": 0.6, 'max_new_tokens': 250 }, huggingfacehub_api_token=HUGGINGFACE_API_KEY)
        PROMPT_SNIP_SUMMARY = PromptTemplate(template=snip_summary_template.format(title=title, summary=summary, text='{text}'), input_variables=["text"])
        # TODO: refine chain? https://python.langchain.com/docs/modules/chains/popular/summarize#the-refine-chain
        chain = load_summarize_chain(llm, chain_type="stuff", verbose=True, prompt=PROMPT_SNIP_SUMMARY)
        # TODO: are metadata necessary?
        text_document = [Document(page_content=text, metadata={"title": title, "summary": summary, "transcript": text})]

    else: # format 1
        llm = HuggingFaceHub(repo_id="tiiuae/falcon-7b-instruct", model_kwargs={"temperature": 0.6, 'max_new_tokens': 1000 }, huggingfacehub_api_token=HUGGINGFACE_API_KEY)
        PROMPT_FULL_SUMMARY = PromptTemplate(template=full_summary_template.format(title=title, text='{text}'), input_variables=["text"])
        # chain = load_summarize_chain(llm, chain_type="stuff", verbose=True, prompt=PROMPT_FULL_SUMMARY)

        chain = load_summarize_chain(llm, chain_type="map_reduce", verbose=True, return_intermediate_steps=False, map_prompt=PROMPT_FULL_SUMMARY, combine_prompt=PROMPT_FULL_SUMMARY)
        # get optimal chunk size given the max number of tokens can be 6000 but we want to split it equally in the least number of chunks
        chunk_size = calculate_chunk_size(len(text))
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=200)
        text_document = text_splitter.split_documents([Document(page_content=text, metadata={"title": title, "transcript": text})])
        
    summary = chain({'input_documents': text_document}, return_only_outputs=True)['output_text'].strip()
    wrapped_summary = textwrap.fill(summary, width=100)
    
    return {"summary": wrapped_summary}

"""
given a youtube transcript, return the video's summary"""
@app.get("/summarize?transcript={transcript}")
async def summarize(transcript: str):
    # set up model
    model_path = "./ggml-gpt4all-j-v1.3-groovy.bin"
    llm = GPT4All(model=model_path)
    # parse transcript
    text = " ".join([line["text"].replace("\n", " ") for line in transcript])
    chain = load_summarize_chain(llm, chain_type="map_reduce", verbose=False)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
    text_document = text_splitter.split_documents([Document(page_content=text)])

    summary = chain.run(text_document)
    wrapped_summary = textwrap.fill(summary, width=100)
    
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
    
def calculate_chunk_size(string_length):
    max_chunk_size = 6000
    num_chunks = ceil(string_length / max_chunk_size)
    chunk_size = ceil(string_length / num_chunks)
    return chunk_size
