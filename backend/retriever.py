import os
import pickle
import faiss
import torch
import torch.nn.functional as F
from transformers import AutoModel, AutoTokenizer, AutoModelForSequenceClassification
from backend.config import (
    CONDITION_MAP,
    EMBEDDING_MODEL_NAME,
    RERANKER_MODEL_NAME,
    FAISS_INDEX_PATH,
    CHUNKS_PKL_PATH
)

# Initialize embedding model
tokenizer_emb = AutoTokenizer.from_pretrained(EMBEDDING_MODEL_NAME, trust_remote_code=True)
model_emb = AutoModel.from_pretrained(EMBEDDING_MODEL_NAME, trust_remote_code=True)

# Initialize reranker
tokenizer_rerank = AutoTokenizer.from_pretrained(RERANKER_MODEL_NAME)
model_rerank = AutoModelForSequenceClassification.from_pretrained(RERANKER_MODEL_NAME)
model_rerank.eval()

# Load FAISS index and chunks
if os.path.exists(FAISS_INDEX_PATH) and os.path.exists(CHUNKS_PKL_PATH):
    index = faiss.read_index(FAISS_INDEX_PATH)
    with open(CHUNKS_PKL_PATH, "rb") as f:
        chunks = pickle.load(f)
else:
    index = None
    chunks = []
    print("Warning: FAISS index or chunks.pkl not found. Please ensure they exist in data/processed/")


def extract_condition_from_query(query: str) -> str:
    """Matches keywords from CONDITION_MAP in the query."""
    query_lower = query.lower()
    for condition in CONDITION_MAP.keys():
        if condition in query_lower:
            return condition
    return None

def embed_query(query: str):
    """Embed the query using HuggingFace approach."""
    inputs = tokenizer_emb(query, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model_emb(**inputs)
    
    # ⚠️ Use Last Token Pooling to match the exact dimensions/logic of your FAISS index
    query_embedding = outputs.last_hidden_state[:, -1, :]
    
    # Convert to float32 numpy array for FAISS
    return query_embedding.float().cpu().numpy()

def metadata_aware_retrieve(query: str, k: int = 30):
    """Search FAISS and filter results based on extracted condition."""
    if index is None or not chunks:
        return []
        
    query_emb = embed_query(query)
    distances, indices = index.search(query_emb, k)
    
    retrieved_chunks = [chunks[i] for i in indices[0] if i < len(chunks)]
    
    condition = extract_condition_from_query(query)
    
    if not condition:
        return retrieved_chunks
        
    section_num = CONDITION_MAP[condition]
    filtered_chunks = []
    
    for chunk in retrieved_chunks:
        chunk_section = chunk.get("metadata", {}).get("section_number", "")
        # Keep if it matches the specific section or is a general section (e.g. intro/methods if applicable)
        if str(chunk_section).startswith(section_num) or "general" in str(chunk_section).lower():
            filtered_chunks.append(chunk)
            
    return filtered_chunks

def rerank_evidence(query: str, retrieved_chunks: list, top_k: int = 3):
    """Rerank chunks using bge-reranker-base."""
    if not retrieved_chunks:
        return []
        
    pairs = [[query, chunk["text"]] for chunk in retrieved_chunks]
    
    inputs = tokenizer_rerank(pairs, padding=True, truncation=True, return_tensors='pt', max_length=512)
    
    with torch.no_grad():
        scores = model_rerank(**inputs).logits.view(-1).float()
        
    # Sort by scores descending
    ranked_indices = torch.argsort(scores, descending=True).tolist()
    
    reranked_chunks = [retrieved_chunks[i] for i in ranked_indices[:top_k]]
    return reranked_chunks
