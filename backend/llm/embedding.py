import os
from langchain_community.embeddings import DeepInfraEmbeddings


DEEPINFRA_EMBEDDINGS_ID = "Qwen/Qwen3-Embedding-8B"
DEEPINFRA_TOKEN = os.environ["DEEPINFRA_TOKEN"]


def get_embedding_model():
    return DeepInfraEmbeddings(
        model_id=DEEPINFRA_EMBEDDINGS_ID,
        deepinfra_api_token=DEEPINFRA_TOKEN,
    )
