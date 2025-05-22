from openai import OpenAI
import os

# Creates an instance of OpenAI using the key from the .env vars
# client can now make requests
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Model for generating embeddings
# Embeddings are numerical representations or real world objects
EMBEDDING_MODEL = "text-embedding-3-small"

def get_embedding(text: str) -> list[float]:
    """
    Returns the embedding vector for a given input text.
    """
    # sends a request to the OpenAI API to generate the embedding
    response = client.embeddings.create(
        # Wraps the text in a list - supports batch
        input=[text],
        # Tells the api which embedding model to use
        model=EMBEDDING_MODEL
    )
    # returns the list of embedding results
    return response.data[0].embedding
