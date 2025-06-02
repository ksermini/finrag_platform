def build_group_prompt(rag_config, role: str) -> str:
    if rag_config and rag_config.enabled:
        template = rag_config.prompt_template or "You are a helpful {tone} assistant for the group."
        return template.format(tone=rag_config.tone or "professional")
    return f"You are a helpful {role}. Use only the group’s SOPs."
