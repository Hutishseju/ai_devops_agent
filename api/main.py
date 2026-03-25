from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from api.routes import router

app = FastAPI()

# ✅ DEFINE TEMPLATE ENGINE ONCE
app.state.templates = Jinja2Templates(directory="frontend/templates")

# Static files
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

# Include routes
app.include_router(router)