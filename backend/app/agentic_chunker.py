import os
import uuid
from typing import Optional
import sys
from datetime import datetime
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI


class AgenticChunker:
    """
    Groups related text propositions into semantically meaningful chunks.
    Adds LLM-generated summaries and titles per chunk.
    """

    def __init__(self, openai_api_key=None, enable_logging=True):
        self.chunks = {}
        self.id_truncate_limit = 5
        self.enable_logging = enable_logging

        if openai_api_key is None:
            openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            raise ValueError("OPENAI_API_KEY is missing")

        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            openai_api_key=openai_api_key,
            temperature=0
        )

    def add_proposition(self, proposition: str):
        """
        Add a single proposition and form a new chunk for it.

        Args:
            proposition (str): A sentence or small paragraph to cluster.
        """
        if self.enable_logging:
            print(f"\nAdding proposition: {proposition}")

        new_chunk_id = str(uuid.uuid4())[:self.id_truncate_limit]
        summary = self._get_summary(proposition)
        title = self._get_title(summary)

        self.chunks[new_chunk_id] = {
            "chunk_id": new_chunk_id,
            "propositions": [proposition],
            "title": title,
            "summary": summary
        }

        if self.enable_logging:
            print(f"Created chunk ID {new_chunk_id}")
            print(f"Title: {title}")
            print(f"Summary: {summary}")

    def get_chunks(self, get_type="list_of_strings"):
        """
        Return all chunk contents in desired format.

        Args:
            get_type (str): 'list_of_strings' or 'dict'

        Returns:
            list or dict: Chunk data
        """
        if get_type == "list_of_strings":
            return [" ".join(chunk["propositions"]) for chunk in self.chunks.values()]
        return self.chunks

    def _get_summary(self, proposition: str) -> str:
        """
        Generate a summary of a single proposition.
        """
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Summarize the topic of the following sentence. Generalize it if possible."),
            ("user", "{proposition}")
        ])
        result = (prompt | self.llm).invoke({"proposition": proposition}).content

        if self.enable_logging:
            print(f"Generated summary: {result}")
        return result

    def _get_title(self, summary: str) -> str:
        """
        Generate a title from a summary.
        """
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Generate a short title based on the following summary."),
            ("user", "{summary}")
        ])
        result = (prompt | self.llm).invoke({"summary": summary}).content

        if self.enable_logging:
            print(f"Generated title: {result}")
        return result
