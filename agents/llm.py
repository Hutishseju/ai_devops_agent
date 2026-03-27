import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("MISTRAL_API_KEY")

if not API_KEY:
    raise ValueError("MISTRAL_API_KEY not found in .env")

URL = "https://api.mistral.ai/v1/chat/completions"


# 🔹 Basic single prompt (your existing use-case)
def ask_llm(prompt):
    return ask_llm_with_memory([
        {"role": "user", "content": prompt}
    ])


# 🔹 Memory-based chat (USED BY UI)
def ask_llm_with_memory(messages):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    # ✅ Work on a copy, don't mutate the original
    messages = list(messages)

    if not any(msg["role"] == "system" for msg in messages):
        messages.insert(0, {
            "role": "system",
            "content": """
You are a senior DevOps engineer.

Rules:
- Always format responses using proper markdown
- Use headings, bullet points, and spacing
- Wrap ALL code (YAML, Terraform, Bash) inside triple backticks
- Keep explanations separate from code blocks
- Do NOT inline code in text
"""
})

    data = {
        "model": "mistral-small-latest",
        "messages": messages
    }

    response = requests.post(URL, headers=headers, json=data)

    if response.status_code != 200:
        return f"Error: {response.text}"

    return response.json()["choices"][0]["message"]["content"]