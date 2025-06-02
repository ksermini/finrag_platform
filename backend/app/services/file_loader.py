from fastapi import UploadFile
from PyPDF2 import PdfReader
from app.vector_store import add_to_vectorstore
from app.agentic_chunker import AgenticChunker
import os
import logging

# Configure logging (put this once, ideally in your app startup file)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),  # console
        logging.FileHandler("ingest_debug.log")  # file
    ]
)

logger = logging.getLogger(__name__)

async def ingest_document(file: UploadFile, user_id: str = None):
    """
    Ingest a PDF document: extract its text, group semantically, and store embeddings.

    This function:
    - Saves the uploaded file temporarily
    - Extracts text from the PDF
    - Feeds text into an LLM-powered chunker (AgenticChunker)
    - Pushes the grouped chunks to the vector store
    - Cleans up the temporary file

    Args:
        file (UploadFile): The uploaded file (PDF expected).
        user_id (str, optional): ID of the user uploading the file for metadata tagging.

    Returns:
        dict: Message confirming the number of grouped chunks ingested.
    """
    logger.info("[ingest_document] Starting ingestion")
    contents = await file.read()
    filename = file.filename
    logger.info(f"[ingest_document] Received file: {filename}")

    # Save file temporarily
    temp_path = f"tmp_{filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)
    logger.info(f"[ingest_document] File saved to temporary path: {temp_path}")

    # Extract text and clean up
    text = extract_text_from_pdf(temp_path)
    os.remove(temp_path)
    logger.info(f"[ingest_document] Extracted text length: {len(text)} characters")

    # Initialize agentic chunker
    logger.info("[ingest_document] Initializing AgenticChunker")
    chunker = AgenticChunker()
    logger.info("[ingest_document] AgenticChunker initialized")

    # Add text paragraph by paragraph
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    logger.info(f"[ingest_document] Found {len(paragraphs)} paragraphs to chunk")

    for i, paragraph in enumerate(paragraphs):
        logger.info(f"[ingest_document] Adding paragraph {i+1}/{len(paragraphs)}")
        chunker.add_proposition(paragraph)

    # Get final chunks as strings
    chunks = chunker.get_chunks(get_type='list_of_strings')
    logger.info(f"[ingest_document] Created {len(chunks)} grouped chunks")

    # Store in vectorstore
    add_to_vectorstore(chunks, filename=filename, user_id=user_id)
    logger.info("[ingest_document] Stored chunks in vectorstore")

    return {"message": f"Ingested {len(chunks)} intelligent chunks from {filename}"}


def extract_text_from_pdf(path):
    """
    Extract raw text from all pages of a PDF file.

    Args:
        path (str): File path to the PDF.

    Returns:
        str: Concatenated text extracted from each page.
    """
    reader = PdfReader(path)
    text = "\n".join([page.extract_text() or "" for page in reader.pages])
    logger.info(f"[extract_text_from_pdf] Extracted {len(reader.pages)} pages from PDF")
    return text
