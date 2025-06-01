import re
from typing import Optional

ROLE_INPUT_POLICY = {
    "Finance Analyst": {"max_tokens": 300, "banned_phrases": ["projected returns"]},
    "Developer": {"allow_code": True},
    "Support Agent": {"limit_topic": "support"},
}

class SecurityService:
    def __init__(self, role: str):
        self.role = role
        self.policy = ROLE_INPUT_POLICY.get(role, {})

    def scan_query(self, query: str) -> Optional[str]:
        # Pattern-based scan
        if re.search(r"(bypass auth|drop\s+table)", query.lower()):
            return "This request may violate usage policies."

        # Banned phrases
        if banned := self.policy.get("banned_phrases"):
            for phrase in banned:
                if phrase.lower() in query.lower():
                    return f"Query contains restricted phrase: '{phrase}'"

        # Topic limits
        if limit := self.policy.get("limit_topic"):
            if limit not in query.lower():
                return f"Only queries related to '{limit}' are allowed."

        return None  # Query is safe
