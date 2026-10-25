# Testing & Quality Assurance Manual — Mehndi By Dhirali

## 1. Automated Test Suites

### Backend Unit & Integration Tests (pytest)
The backend test suite covers authentication, server-authoritative calculations, order creation, concurrency, signature verification, and admin access control.

```bash
cd backend
.\venv\Scripts\python.exe -m pytest -v
```

**Test Coverage Summary:**
- `tests/test_health.py`: Verifies `/api/health` and root status.
- `tests/test_auth.py`: Tests user registration, password hashing with Argon2id, duplicate email prevention, and session cookie issuance.
- `tests/test_products.py`: Verifies catalog listings, category filtering, admin product creation, and unauthenticated creation rejection.
- `tests/test_orders.py`: Verifies that order totals and shipping costs are calculated on the server using trusted product records, and checks that ordering beyond current stock is rejected.
- `tests/test_payments.py`: Tests HMAC-SHA256 signature verification, status transitions to `paid`, idempotency handling for repeat callbacks, and non-existent order failure handling.

### Frontend Production Build Verification
The frontend TypeScript and Tailwind v4 compilation is tested using:

```bash
cd frontend
pnpm run build
```

This verifies:
- Strict TypeScript compile without any type errors or missing dependencies.
- CSS design tokens and responsiveness.
- Asset bundler chunk generation.

---

## 2. Production Readiness Checklist

- [x] Website name explicitly set to **Mehndi By Dhirali**.
- [x] Design palette implemented with bottle green (#243F2A), deep forest green (#172D20), henna brown (#70462E), antique gold (#C4A15A), and warm ivory (#F7F1E5).
- [x] Product catalog ready with graceful empty state for owner to add products later.
- [x] Admin dashboard provided with product creation, category management, and order review.
- [x] Server-authoritative order creation preventing client price tampering.
- [x] Official Razorpay test mode payment verification and webhook processing.
- [x] Free-tier deployment configured for Vercel + Neon + Supabase.
- [x] Zero sensitive secrets committed; template `.env.example` files provided.
- [x] All 14 automated backend test cases passing.
- [x] Clean frontend production build passing with zero errors.
