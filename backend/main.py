"""
FastAPI entrypoint for Vercel Services.
Exposes 'app' at the root of the backend service.
"""
from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
