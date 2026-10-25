"""
Vercel serverless function entrypoint for backend service.
"""
from app.main import app

handler = app
