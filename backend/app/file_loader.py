from fastapi import UploadFile
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.vector_store import add_to_vectorstore
import os

async def ingest_document(file: UploadFile, user_id: str = None):
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
    reader = PdfReader(path)
    return "\n".join([page.extract_text() or "" for page in reader.pages])
