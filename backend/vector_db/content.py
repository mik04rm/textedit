# import os
# from langchain_postgres import PGVector
# from qdrant_client import QdrantClient
# from qdrant_client.http.models import VectorParams, Distance
# from llm.embedding import get_embedding_model
from langchain_text_splitters import RecursiveCharacterTextSplitter

# from langchain.docstore.document import Document
# from langchain_qdrant import QdrantVectorStore


# pg_user = os.environ["POSTGRES_USER"]
# pg_password = os.environ["POSTGRES_PASSWORD"]
# pg_db = os.environ["POSTGRES_DB"]
# pg_port = os.environ["POSTGRES_PORT"]
# pg_host = os.environ["POSTGRES_HOST"]

# # client = QdrantClient(url="http://localhost:6333")


# connection_string = (
#     f"postgresql+psycopg2://{pg_user}:{pg_password}@{pg_host}:{pg_port}/{pg_db}"
# )


# embedding_model = get_embedding_model()

# vectorstore = PGVector(
#     connection=connection_string,
#     collection_name="placeholder_collection", # TODO
#     embeddings=embedding_model,
# )


def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )

    return splitter.split_text(text)


# def add_document(doc_id: int, text: str):
#     """
#     For now adding whole document to the db (later adding only the changing elements, not whole document).
#     get_embedding: function that takes text and returns a vector.
#     """
#     chunks = chunk_text(text)

#     docs = [
#         Document(page_content=chunk, metadata={"doc_id": doc_id}) for chunk in chunks
#     ]

#     vectorstore.add_documents(docs)


# def get_retriever(
#     doc_ids: list[int] | None = None,
#     top_k: int = 5,
# ):

#     search_kwargs: dict = {"k": top_k}
#     if doc_ids:
#         search_kwargs["filter"] = {"doc_id": {"$in": doc_ids}}

#     return vectorstore.as_retriever(search_kwargs=search_kwargs)
