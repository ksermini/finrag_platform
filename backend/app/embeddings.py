from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
EMBEDDING_MODEL = "text-embedding-3-small"


def get_embedding(text: str) -> list[float]:
    """
    Generate an embedding vector for a single text input.

    Args:
        text (str): A single string of text to embed.

    Returns:
        list[float]: The embedding vector for the input text.
    """
    return get_embeddings([text])[0]


def get_embeddings(texts: list[str]) -> list[list[float]]:
    """
    Generate embeddings for a list of input texts using OpenAI's embedding model.

    This function uses batch processing for efficiency.

    Args:
        texts (list[str]): A list of input texts.

    Returns:
        list[list[float]]: A list of embedding vectors, one per input text.
    """
    response = client.embeddings.create(input=texts, model=EMBEDDING_MODEL)
    return [item.embedding for item in response.data]
