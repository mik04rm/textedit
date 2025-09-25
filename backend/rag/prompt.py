from typing import List
from langchain.schema import Document

def build_generation_prompt(question: str, docs: List[Document]) -> str:
    """
    Build a prompt for the RAG LLM node.
    """
    context = "\n---\n".join(d.page_content for d in docs)
    prompt = (
        f"Answer the question strictly based on the following sources.\n"
        f"If the sources do not contain the answer, say so explicitly.\n\n"
        f"Question: {question}\n\n"
        f"Sources:\n{context}"
    )
    return prompt
