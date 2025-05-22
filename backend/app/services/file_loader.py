from fastapi import UploadFile
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.vector_store import add_to_vectorstore
import os

async def ingest_document(file: UploadFile):
    contents = await file.read()
    filename = file.filename

    with open(f"tmp_{filename}", "wb") as f:
        f.write(contents)

    text = extract_text_from_pdf(f"tmp_{filename}")
    os.remove(f"tmp_{filename}")

    if not text.strip():
        return {"error": "File appears to be empty or unreadable."}

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(text)

    if not chunks:
        return {"error": "No text chunks were extracted from the document."}

    add_to_vectorstore(chunks)
    return {"message": f"Ingested {len(chunks)} chunks from {filename}"}

def extract_text_from_pdf(path):
    reader = PdfReader(path)
    return "\n".join([page.extract_text() or "" for page in reader.pages])
