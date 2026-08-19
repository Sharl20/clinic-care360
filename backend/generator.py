from groq import Groq
from backend.config import GROQ_API_KEY, LLM_MODEL_NAME

# Initialize the Groq Client
client = Groq(api_key=GROQ_API_KEY)

def build_clinical_prompt(query: str, chunks: list) -> str:
    """Combine chunks into clear text."""
    context_text = ""
    for i, chunk in enumerate(chunks):
        meta = chunk.get("metadata", {})
        
        # التعديل هنا: لو ملقاش اسم القسم، هيستخدم اسم الملف (source) ورقم الصفحة (page)
        section_name = meta.get("section_name", meta.get("source", "WHO Rehabilitation Guidelines"))
        section_number = meta.get("section_number", f"Page {meta.get('page', 'N/A')}")
        text = chunk.get("text", "")
        
        context_text += f"\n--- Evidence {i+1} ---\n"
        context_text += f"Source: {section_name}, Section {section_number}\n"
        context_text += f"Content: {text}\n"
        
    return context_text

def generate_clinical_answer(query: str, chunks: list) -> str:
    """Generate answer using Groq API."""
    if not chunks:
        return "I could not find relevant clinical evidence in the WHO guidelines to answer your query."
        
    context = build_clinical_prompt(query, chunks)
    
    system_prompt = (
        "You are Care360, an advanced AI clinical assistant. "
        "You must answer the user's question by analyzing the provided WHO 'Package of interventions for rehabilitation' evidence. "
        "Do not hallucinate or include outside information. "
        "CRITICAL RULE: When providing recommendations, exercises, or suggestions to the user, you must clearly frame them as *AI suggestions and recommendations derived from the WHO guidelines*, using phrases like 'Based on the WHO guidelines, I suggest...', 'As an AI assistant, I recommend...', or 'Here are my suggestions based on the evidence...'. "
        "You MUST include explicit citations in your answer using this exact format: "
        "(Source: [Section Name], Section [Section Number])."
    )

    user_prompt = f"Context:\n{context}\n\nQuestion: {query}"
    
    try:
        response = client.chat.completions.create(
            model=LLM_MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=2048  # تم رفع الحد الأقصى عشان الإجابة ماتتقطعش في النص
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error communicating with Groq API: {str(e)}"