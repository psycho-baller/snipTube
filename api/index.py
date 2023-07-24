from fastapi import FastAPI

app = FastAPI(docs_url="/api/llm/docs", openapi_url="/api/llm/openapi.json")

@app.get("/api/llm/healthchecker")
def healthchecker():
    return {"status": "success", "message": "Integrated FastAPI Framework with Next.js and chrome extension successfully!"}