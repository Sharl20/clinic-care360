import os

# إجبار النظام على استخدام الـ D Drive لتحميل وتخزين الموديلات
os.environ["HF_HOME"] = "E:\\HF_Cache"
# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
PROCESSED_DATA_DIR = os.path.join(DATA_DIR, "processed")

# Data files
FAISS_INDEX_PATH = os.path.join(PROCESSED_DATA_DIR, "my_rag.index")
CHUNKS_PKL_PATH = os.path.join(PROCESSED_DATA_DIR, "chunks.pkl")

# Model Names/Paths
# Model Names/Paths
EMBEDDING_MODEL_NAME = "Qwen/Qwen3-Embedding-0.6B"
RERANKER_MODEL_NAME = "BAAI/bge-reranker-base"


GROQ_API_KEY = "API-key"
LLM_MODEL_NAME = "openai/gpt-oss-120b"
CONDITION_MAP = {
    "low back pain": "1.",
    "osteoarthritis": "2.",
    "rheumatoid arthritis": "3.",
    "sarcopenia": "4.",
    "fractures": "5.",
    "amputation": "6."
}
