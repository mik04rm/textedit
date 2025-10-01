from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Tuple
from langchain.schema import Document, HumanMessage
from llm.embedding import get_embedding_model
from llm.model import get_llm
from rag.prompt import build_generation_prompt
from api.models import DocumentChunk
from pgvector.django import CosineDistance

llm = get_llm()
embedding_model = get_embedding_model()


class RAGState(TypedDict):
    question: str
    docs: List[DocumentChunk]
    answer: str
    doc_ids: List[int] | None
    top_k: int


def retrieve_node(state: RAGState):

    question_embedding = embedding_model.embed_query(state["question"])

    qs = DocumentChunk.objects.all()
    if state.get("doc_ids"):
        qs = qs.filter(document_id__in=state["doc_ids"])

    docs = list(
        qs.order_by(
            CosineDistance("qwen3_embedding_8b", question_embedding)
        )[: state["top_k"]]
    )

    return {"docs": docs}


def generate_node(state: RAGState):
    if not state["docs"]:
        answer = "I didn't find relevant information in documents."
    else:
        doc_texts = [d.chunk_content for d in state["docs"]]
        doc_prompt = build_generation_prompt(state["question"], doc_texts)
        messages = [HumanMessage(content=doc_prompt)]
        answer_message = llm.invoke(messages)
        answer = answer_message.content

    return {"answer": answer}



workflow = StateGraph(RAGState)
workflow.add_node("retrieve", retrieve_node)
workflow.add_node("generate", generate_node)

workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)

rag_chain = workflow.compile()
