from langchain_openai import ChatOpenAI
import os

from pydantic import SecretStr

DEEPINFRA_TOKEN = os.environ["DEEPINFRA_TOKEN"]


def get_llm():
    return ChatOpenAI(
        model="Qwen/Qwen3-32B",
        api_key=SecretStr(DEEPINFRA_TOKEN),
        base_url="https://api.deepinfra.com/v1/openai",
        temperature=0.1,
        max_completion_tokens=512,
    )
