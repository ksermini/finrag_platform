
# System Relationships

## Groups

- Each **Group** represents a business unit or domain (e.g. Finance, Risk, Ops).
- Groups have:
  - A name, description
  - A default agent role for prompt engineering
  - A unique set of embedded documents in the vector store

## Users

- Users can belong to **multiple groups**, each with an assigned **role** (e.g. `member`, `manager`, `reviewer`).
- Each user’s query context is scoped by their group and role, enabling fine-tuned responses.

## Documents

- Documents are always **associated with a group** — never global.
- Uploading a document to `/groups/{group_id}/documents`:
  - Extracts text from PDF/TXT
  - Splits it into chunks
  - Embeds into a **group-specific** vectorstore

## Flow Summary

1. User logs in
2. System determines primary group
3. User uploads a doc assigned to group
4. User submits a query:
   - Group and role affect prompt
   - Vectorstore retrieves group-specific context
   - Answer is generated and optionally cached
