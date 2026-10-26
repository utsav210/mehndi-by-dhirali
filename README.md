# Mehndi By Dhirali — Premium Mehndi E-commerce

A full-stack e-commerce website for **Mehndi By Dhirali**, selling premium mehndi cones, mehndi powder, bridal & student mehndi kits, and accessories.

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Python FastAPI + SQLAlchemy + Alembic
- **Database:** Neon PostgreSQL
- **Payments:** Razorpay
- **Storage:** Supabase Storage
- **Hosting:** Vercel (frontend + backend)

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL (or Neon account)

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Environment Variables

Copy `.env.example` files in both `frontend/` and `backend/` directories and fill in the required values.

## Project Structure

```
├── frontend/          # React SPA
├── backend/           # FastAPI API
├── api/               # Vercel serverless entry
├── docs/              # Documentation
├── scripts/           # Utility scripts
├── vercel.json        # Vercel deployment config
└── README.md
```

## Documentation

- [Architecture](docs/architecture.md)
- [Security](docs/security.md)
- [API Reference](docs/api.md)
- [Deployment](docs/deployment.md)
- [Testing](docs/testing.md)

## License

Private — All rights reserved.

---

> **Note:** This project uses Razorpay test mode. Do not switch to live mode without explicit owner approval.
