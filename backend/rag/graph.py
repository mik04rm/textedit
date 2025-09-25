from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Tuple
from langchain.schema import Document, HumanMessage
from llm.model import get_llm
from vector_db.retriever import get_retriever
from rag.prompt import build_generation_prompt

llm = get_llm()


class RAGState(TypedDict):
    question: str
    docs: List[Document]
    answer: str
    doc_ids: List[int] | None
    top_k: int


def retrieve_node(state: RAGState):
    retriever = get_retriever(doc_ids=state.get("doc_ids"), top_k=state.get("top_k"))
    docs = retriever.invoke(state["question"])
    return {"docs": docs}


def generate_node(state: RAGState):
    if not state["docs"]:
        answer = "I didn't find relevant information in documents."
    else:
        doc_prompt = build_generation_prompt(state["question"], state["docs"])
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
