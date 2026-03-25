from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

from agents.llm import ask_llm_with_memory

router = APIRouter()

chat_history = []


class ChatRequest(BaseModel):
    message: str


@router.get("/", response_class=HTMLResponse)
def home(request: Request):
    return request.app.state.templates.TemplateResponse(
    request,           # ✅ request is now the FIRST positional argument
    "index.html"
)

def clean_text(text: str):
    return (
        text.replace("**", "")
            .replace("*", "")
            .replace("###", "")
            .replace("##", "")
            .strip()
    )

@router.post("/chat")
def chat(req: ChatRequest):
    user_message = req.message

    chat_history.append({"role": "user", "content": user_message})

    response = ask_llm_with_memory(chat_history)

    clean_response = clean_text(response)

    chat_history.append({"role": "assistant", "content": clean_response})

    return {
        "response": clean_response,
        "history": chat_history
    }