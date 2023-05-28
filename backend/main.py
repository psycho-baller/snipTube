from fastapi import FastAPI
import requests
import os
from youtube_transcript_api import YouTubeTranscriptApi
from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain.document_loaders import YoutubeLoader
from langchain.llms import OpenAI
from langchain.chains.summarize import load_summarize_chain

FLOWISE_API_KEY: str = os.getenv("FLOWISE_API_KEY")
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
API_URL = "http://localhost:3000/api/v1/prediction/08251153-caae-41e7-be83-fd294358e304"
headers = {"Authorization": "Bearer " + FLOWISE_API_KEY}
app = FastAPI()

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

@app.get("/")
async def root():
    return query({
    "question": "USA",
})

"""
given a youtube video_id, return the video's summary. There are 2 different formats for the summary:
1. just the text of the whole summary
2. summary of specific time intervals, with that, we need to pass the start and end time of the interval
"""
@app.get("/summary/{video_id}")
async def summary(video_id: str, start_time: int = None, end_time: int = None):
    loader = YoutubeLoader.from_youtube_url(f"https://www.youtube.com/watch?v={video_id}", add_video_info=True)
    transcript = loader.load()
    
    # if start_time and end_time: # format 2
    #     transcript = YouTubeTranscriptApi.get_transcript(video_id, start_time, end_time)
    # else: # format 1
    #     transcript = YouTubeTranscriptApi.get_transcript(video_id)
    
    llm = OpenAI(temperature=0, openai_api_key=OPENAI_API_KEY)
    chain = load_summarize_chain(llm, chain_type="map_reduce", verbose=True)
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)

    texts = text_splitter.split_documents(transcript)

    return chain.run(texts)