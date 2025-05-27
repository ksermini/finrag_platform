from fastapi import UploadFile
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.vector_store import add_to_vectorstore
import os

async def ingest_document(file: UploadFile, user_id: str = None):
    """
    Ingest a PDF document: extract its text, chunk it, and store embeddings.

    This function:
    - Saves the uploaded file temporarily
    - Extracts text from the PDF
    - Splits the text into overlapping chunks
    - Pushes the chunks to the vector store
    - Cleans up the temporary file

    Args:
        file (UploadFile): The uploaded file (PDF expected).
        user_id (str, optional): ID of the user uploading the file for metadata tagging.

    Returns:
        dict: Message confirming the number of chunks ingested and filename.
    """
    contents = await file.read()
    filename = file.filename

    temp_path = f"tmp_{filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)

    text = extract_text_from_pdf(temp_path)
    os.remove(temp_path)

    splitter = RecursiveCharacterTextSplitter(chunk_size=750, chunk_overlap=50)
    chunks = splitter.split_text(text)

    add_to_vectorstore(chunks, filename=filename, user_id=user_id)

    return {"message": f"Ingested {len(chunks)} chunks from {filename}"}


def extract_text_from_pdf(path):
    """
    Extract raw text from all pages of a PDF file.

    Args:
        path (str): File path to the PDF.

    Returns:
        str: Concatenated text extracted from each page.
    """
    reader = PdfReader(path)
    return "\n".join([page.extract_text() or "" for page in reader.pages])
