from base64 import b64decode
import os
import textwrap
from math import ceil
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env.

from fastapi import FastAPI
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.llms import HuggingFaceHub
from langchain_openai.llms import OpenAI
from langchain.chains.summarize import load_summarize_chain
from langchain.docstore.document import Document

# from prompts import full_summary_template, snip_summary_template_with_context, snip_summary_template


class SummarizeSnip(BaseModel):
    title: str
    summary: str = None
    transcript: str
    encoded: bool = True


dev = os.getenv("FASTAPI_ENV") == "development"

# headers = {"Authorization": "Bearer " + FLOWISE_API_KEY}
app = FastAPI(
    docs_url="/api/llm/docs",
    redoc_url="/api/llm/redoc",
    openapi_url="/api/llm/openapi.json",
)

# CORS configuration
origins = [
    "https://www.youtube.com",
    "http://localhost:3000",
    "https://sniptube.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["content-type"],
)


@app.get("/api/llm/healthchecker")
def healthchecker():
    return {
        "status": "success",
        "message": "Integrated FastAPI Framework with Next.js and chrome extension successfully!",
    }


@app.post("/api/llm/summarize/snip")
async def summarizeSnip(item: SummarizeSnip):
    # set up model
    # llm = GPT4All(model=model_path, temp=0.1)
    # llm = Cohere(model="summarize-xlarge", cohere_api_key=COHERE_API_KEY, temperature=0.1)
    # OpenAI(temperature=0.6) if not dev else
    llm = (
        OpenAI(temperature=0.6)
        if not dev
        else HuggingFaceHub(
            repo_id="tiiuae/falcon-7b-instruct",
            model_kwargs={"temperature": 0.6, "max_new_tokens": 1000},
        )
    )

    if item.encoded:
        # decode from base64
        title = b64decode(item.title).decode("utf-8")
        text = b64decode(item.transcript).decode("utf-8")
        summary = b64decode(item.summary).decode("utf-8") if item.summary else None
    else:
        title = item.title
        text = item.transcript
        summary = item.summary if item.summary else None
    PROMPT_SNIP_SUMMARY = PromptTemplate(
        template=snip_summary_template.format(title=title, text="{text}"),
        input_variables=["text"],
    )
    # TODO: refine chain? https://python.langchain.com/docs/modules/chains/popular/summarize#the-refine-chain
    chain = load_summarize_chain(
        llm, chain_type="stuff", verbose=True, prompt=PROMPT_SNIP_SUMMARY
    )
    # TODO: are metadata necessary?
    text_document = [
        Document(
            page_content=text,
            metadata={"title": title, "summary": summary, "transcript": text},
        )
    ]

    summary = chain.invoke(
        {"input_documents": text_document}, return_only_outputs=True
    )["output_text"].strip()
    wrapped_summary = textwrap.fill(summary, width=100)

    return {"summary": wrapped_summary}


#  ---------------------------PROMPTS----------------------------------------------------------------------------------------------------

snip_summary_template = """You are a youtube section summarizer. Which means you will be given the transcript of a section of a youtube video and you need to summarize that transcript of the youtube video into a concise sentence. The sentence should only describe the main points of the given transcript


TRANSCRIPT OF SECTION OF VIDEO TO CONCISELY SUMMARIZE:
{text}


CONCISE SUMMARIZED SENTENCE FROM TRANSCRIPT(only write one sentence):
"""
