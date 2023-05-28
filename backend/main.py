from fastapi import FastAPI
import requests
import os

FLOWISE_API_KEY: str = os.getenv("FLOWISE_API_KEY")
API_URL = "http://localhost:3000/api/v1/prediction/08251153-caae-41e7-be83-fd294358e304"
headers = {"Authorization": "Bearer " + FLOWISE_API_KEY}
# payload = 
app = FastAPI()

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

@app.get("/")
async def root():
    return query({
    "question": "USA",
})
