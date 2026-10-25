# Security Architecture & Data Protection — Mehndi By Dhirali

## 1. Threat Mitigation Matrix

| Security Threat | Technical Control & Implementation |
| :--- | :--- |
| **SQL Injection** | Parameterized queries enforced via SQLAlchemy ORM 2.x and Pydantic validation schemas. Raw string concatenation is prohibited. |
| **Cross-Site Scripting (XSS)** | React JSX output automatic string escaping, plus strict HTTP response security headers (`X-XSS-Protection`, `X-Content-Type-Options: nosniff`). |
| **Cross-Site Request Forgery (CSRF)** | HttpOnly cookies configured with `SameSite=Lax` and `Secure=True`. In addition, CORS requires explicit origin whitelist matching. |
| **Payment Tampering** | Orders are verified using HMAC-SHA256 signature algorithm against server-stored order identifiers and provider secrets. Client-supplied totals are never accepted. |
| **Webhook Replay Attacks** | Every Razorpay webhook payload signature is checked against raw bytes using `RAZORPAY_WEBHOOK_SECRET`. Unique `event_id` is persisted and deduplicated. |
| **Broken Access Control / IDOR** | `get_admin_user` dependency enforces `role == 'admin'` at the API route level. Customer orders and addresses enforce ownership checks against the authenticated user ID. |
| **Credential & Secret Exposure** | Credentials are kept exclusively in environment variables. Safe `.env.example` templates contain only placeholders. `.env` and `*.db` are strictly excluded in `.gitignore`. |
| **Password Security** | Password hashes generated with Argon2id (`argon2-cffi`), resistant to GPU/ASIC brute force attacks. Minimum length is enforced at 8 characters. |
| **Inventory Race Conditions** | Row-level locking (`with_for_update`) during checkout order creation and atomic stock decrement upon payment verification. |
| **Malicious File Uploads** | MIME type whitelisting (`image/jpeg`, `image/png`, `image/webp`), strict 5 MB file size boundary, and UUID-based collision-proof filename generation. |

## 2. Privacy & Data Protection Compliance

- **Indian IT Act, 2000 & SPDI Rules (2011):** Customer passwords, card details, or sensitive financial information are never logged or stored on application servers.
- **Payment Card Data (PCI-DSS):** Card numbers, CVVs, and UPI pins are processed directly within Razorpay's PCI-DSS compliant checkout iframe, ensuring zero PCI scope on the store's servers.
- **Data Minimization:** Customer addresses and order histories are collected strictly for order fulfillment and tax invoices.
