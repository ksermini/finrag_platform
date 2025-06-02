# FinRAG Data Dictionary

This document describes the schema of the core database tables used in the FinRAG platform.

---

## `users`

| Column          | Type                  | Nullable | Description                                |
|-----------------|-----------------------|----------|--------------------------------------------|
| id              | integer               | NO       | Primary key                                |
| email           | varchar               | NO       | User email address                         |
| first_name      | varchar               | NO       | First name                                 |
| last_name       | varchar               | NO       | Last name                                  |
| hashed_password | varchar               | NO       | Securely stored password hash              |
| is_active       | boolean               | NO       | User account status                        |
| role            | varchar               | NO       | System-wide role (e.g., USER, ADMIN)       |
| business_group  | varchar               | YES      | Optional business group affiliation        |
| is_admin        | boolean               | YES      | Whether the user has admin privileges      |
| permissions     | varchar               | YES      | Comma-separated string of access flags     |
| created_at      | timestamp             | NO       | User creation time                         |
| last_login      | timestamp             | YES      | Last login timestamp                       |
| account_status  | varchar               | NO       | Current account state (e.g., pending)      |
| phone_number    | varchar               | YES      | Optional contact number                    |
| department      | varchar               | YES      | Department the user belongs to             |
| job_title       | varchar               | YES      | Role/title within the org                  |
| manager_id      | integer               | YES      | Reference to a user who is their manager   |
| created_by      | integer               | YES      | Who created this user                      |
| updated_at      | timestamp             | YES      | Last updated time                          |
| notes           | varchar               | YES      | Freeform text notes                        |

---

## `groups`

| Column              | Type      | Nullable | Description                              |
|---------------------|-----------|----------|------------------------------------------|
| id                  | uuid      | NO       | Unique group ID                          |
| name                | text      | YES      | Group name                               |
| description         | text      | YES      | Group description                        |
| default_agent_role  | text      | YES      | Default role used for prompt config      |
| created_at          | timestamp | YES      | Group creation timestamp                 |

---

## `user_groups`

| Column   | Type      | Nullable | Description                        |
|----------|-----------|----------|------------------------------------|
| user_id  | integer   | NO       | ID of the user                     |
| group_id | uuid      | NO       | ID of the group                    |
| role     | varchar   | NO       | Role of the user in the group      |
| added_at | timestamp | YES      | Timestamp of role assignment       |

---

## `group_documents`

| Column      | Type      | Nullable | Description                                      |
|-------------|-----------|----------|--------------------------------------------------|
| id          | uuid      | NO       | Unique identifier                               |
| group_id    | uuid      | NO       | ID of the group this document belongs to        |
| title       | text      | YES      | Title of the document                           |
| content     | text      | YES      | Raw extracted text                              |
| file_path   | text      | YES      | Path to the uploaded file                       |
| embedded    | boolean   | YES      | Whether the file has been embedded              |
| created_at  | timestamp | YES      | Time of upload                                  |
| created_by  | varchar   | YES      | ID of the uploading user                        |

---

## `genai_metadata`

| Column              | Type      | Nullable | Description                                |
|---------------------|-----------|----------|--------------------------------------------|
| id                  | integer   | NO       | Metadata record ID                         |
| query_id            | integer   | YES      | Link to the audit log                      |
| user_id             | varchar   | YES      | ID of querying user                        |
| model_name          | varchar   | YES      | Name of LLM model used                     |
| tokens_input        | integer   | YES      | Number of input tokens                     |
| tokens_output       | integer   | YES      | Number of output tokens                    |
| latency_ms          | integer   | YES      | Response time in milliseconds              |
| retrieved_docs_count| integer   | YES      | Number of docs fetched from vectorstore    |
| source_type         | varchar   | YES      | Vector source used                         |
| timestamp           | timestamp | YES      | Time of request                            |
| cached              | varchar   | YES      | Whether response was from cache            |

---

## `rag_group_config`

| Column           | Type      | Nullable | Description                                  |
|------------------|-----------|----------|----------------------------------------------|
| group_id         | uuid      | NO       | Group this config belongs to                 |
| tone             | text      | YES      | Voice style (e.g., formal, casual)           |
| temperature      | float     | YES      | LLM sampling temperature                     |
| prompt_template  | text      | YES      | Custom prompt template                       |
| enabled          | boolean   | YES      | Whether config is active                     |
| created_at       | timestamp | YES      | Creation time                                |