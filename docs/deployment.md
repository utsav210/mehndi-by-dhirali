# Deployment Guide — 100% Free Tier on Vercel

This application is architected to run completely free using established cloud free tiers:

1. **Frontend + API Runtime:** Vercel (Hobby Free Tier)
2. **Database:** Neon PostgreSQL (Free Tier with serverless connection pooling)
3. **Product Media Storage:** Supabase Storage (Free Tier - 1 GB storage + 2 GB bandwidth)
4. **Payment Gateway:** Razorpay (Standard Free Test Mode)

---

## 1. Neon PostgreSQL Setup (Free)

1. Sign up at [neon.tech](https://neon.tech).
2. Create a project named `mehndi-by-dhirali`.
3. Select your preferred region (e.g. `ap-southeast-1` or `eu-central-1`).
4. In the Dashboard, copy the **Connection string with pooling enabled** (`neondb?sslmode=require`).
5. Save this as your `DATABASE_URL` environment variable.

---

## 2. Supabase Storage Setup (Free)

1. Sign up at [supabase.com](https://supabase.com).
2. Create a new project.
3. In the sidebar, navigate to **Storage** and click **New Bucket**.
4. Name the bucket `mehndi-products` and toggle **Public bucket: ON**.
5. Go to **Project Settings -> API** and copy:
   - Project URL (`SUPABASE_URL`)
   - `service_role` secret key (`SUPABASE_SERVICE_ROLE_KEY`)

---

## 3. Razorpay Payment Gateway Setup (Test Mode)

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Toggle to **Test Mode** in the header.
3. Navigate to **Account & Settings -> API Keys** and generate test keys:
   - `RAZORPAY_KEY_ID` (begins with `rzp_test_...`)
   - `RAZORPAY_KEY_SECRET`
4. Set up a Webhook in **Settings -> Webhooks**:
   - URL: `https://<your-vercel-domain>.vercel.app/api/webhooks/razorpay`
   - Active Events: `payment.captured`, `payment.failed`, `order.paid`
   - Secret: enter a secure secret and save as `RAZORPAY_WEBHOOK_SECRET`

---

## 4. Deploying to Vercel

### Step 1: Connect Git Repository
1. Push this repository to GitHub or GitLab.
2. In [vercel.com](https://vercel.com), click **Add New -> Project**.
3. Import the `Mehndi-By-Dhirali` repository.

### Step 2: Configure Environment Variables in Vercel Dashboard
Add the following environment variables in the Vercel Project Settings:

```env
# Application
APP_ENV=production
APP_DEBUG=false
APP_NAME="Mehndi By Dhirali API"
ALLOWED_ORIGINS=https://<your-vercel-project>.vercel.app

# Database
DATABASE_URL=postgresql://[user]:[password]@[neon-pooler-host]/neondb?sslmode=require

# Security
JWT_SECRET_KEY=generate-a-strong-random-64-character-hex-string
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=1440

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# Supabase Storage
SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=mehndi-products

# Frontend Public Variables
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=rzp_test_...
VITE_APP_NAME="Mehndi By Dhirali"
```

### Step 3: Run Database Migrations
Run migrations against the Neon database from your local machine before first launch:
```bash
cd backend
$env:DATABASE_URL="postgresql://[user]:[password]@[neon-pooler-host]/neondb?sslmode=require"
.\venv\Scripts\alembic.exe upgrade head
```

### Step 4: Click Deploy
Vercel will build the React SPA and serve the Python FastAPI endpoints through `/api/*`.
