import re

# Simple injection/blocklist examples
BANNED_PATTERNS = [
    r"(;|\b)drop\s+table\b",
    r"\b(bypass|disable|hack)\b",
    r"(?i)projected returns",
    r"\bhow\s+to\s+breach\b",
    r"[^\w\s]{4,}",  # long symbol chains like $$$$
]

ROLE_INPUT_POLICY = {
    "Finance Analyst": {"max_tokens": 300, "banned_phrases": ["projected returns"]},
    "Developer": {"allow_code": True},
    "Support Agent": {"limit_topic": "support"},
}

def check_prompt_security(query: str, role: str = "user") -> tuple[bool, str | None]:
    lowered = query.lower()
    for pattern in BANNED_PATTERNS:
        if re.search(pattern, lowered):
            return True, "⚠️ This request may violate AI usage policy."

    role_policy = ROLE_INPUT_POLICY.get(role)
    if role_policy and "banned_phrases" in role_policy:
        for phrase in role_policy["banned_phrases"]:
            if phrase in lowered:
                return True, f"⚠️ That topic is restricted for your role ({role})."
    return False, None
