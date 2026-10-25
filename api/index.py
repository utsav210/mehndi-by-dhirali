"""
Vercel serverless function entry point for the FastAPI backend.
This file adapts the FastAPI app for Vercel's Python runtime.
"""
import sys
import os

# Add the backend directory to the Python path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend')
sys.path.insert(0, backend_dir)

from app.main import app  # noqa: E402

# Vercel expects the ASGI app to be named 'app' or 'handler'
handler = app
