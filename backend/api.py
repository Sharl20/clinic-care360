from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from backend.retriever import metadata_aware_retrieve, rerank_evidence
from backend.generator import generate_clinical_answer

app = FastAPI(title="Care360 Clinical RAG API")

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    message: str   # بدلاً من query

class SourceItem(BaseModel):
    section_name: str
    section_number: str
    text: str

class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceItem]
@app.post("/api/chat", response_model=QueryResponse)
async def chat_endpoint(request: QueryRequest):
    try:
        # Step 1: Retrieve
        retrieved_chunks = metadata_aware_retrieve(request.message, k=3)
        
        # Step 2: Rerank
        top_chunks = rerank_evidence(request.message, retrieved_chunks, top_k=3)
        
        # Step 3: Generate Answer
        answer = generate_clinical_answer(request.message, top_chunks)
        
        # ... باقي الكود زي ما هو ...
        # Format sources
        sources = []
        for chunk in top_chunks:
            meta = chunk.get("metadata", {})
            sources.append(SourceItem(
                section_name=meta.get("section_name", "Unknown"),
                section_number=meta.get("section_number", "Unknown"),
                text=chunk.get("text", "")
            ))
            
        return QueryResponse(answer=answer, sources=sources)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("backend.api:app", host="0.0.0.0", port=8000, reload=True)
