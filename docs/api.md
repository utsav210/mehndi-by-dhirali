# API Reference Manual — Mehndi By Dhirali

Base URL: `/api`  
Interactive OpenAPI Documentation: `/api/docs` or `/api/redoc`

---

## 1. Storefront & Public Endpoints

### `GET /api/health`
Checks server health and version.
- **Response `200`:** `{"status": "healthy", "app": "Mehndi By Dhirali API", "version": "1.0.0"}`

### `GET /api/products`
Lists published active products with server-side pagination, category filtering, search, and sorting.
- **Query Parameters:**
  - `page`: Integer (default 1)
  - `page_size`: Integer (default 12)
  - `category_slug`: Filter by category slug (e.g. `mehndi-cones`)
  - `search`: Keyword search in title, description, and SKU
  - `sort`: `featured` | `price-asc` | `price-desc` | `newest`
- **Response `200`:** `PaginatedResponse[ProductResponse]`

### `GET /api/products/{slug}`
Retrieves a single product by unique URL slug.
- **Response `200`:** `ProductResponse`
- **Response `404`:** If product not found or inactive

### `GET /api/categories`
Lists all active categories.
- **Response `200`:** `List[CategoryResponse]`

---

## 2. Authentication Endpoints

### `POST /api/auth/register`
Creates a customer account, hashes password via Argon2id, and sets HttpOnly session cookie.
- **Request:** `RegisterRequest` (`email`, `password`, `first_name`, `last_name`, `phone`)
- **Response `201`:** `UserResponse`

### `POST /api/auth/login`
Validates credentials and issues an authenticated session cookie.
- **Request:** `LoginRequest` (`email`, `password`)
- **Response `200`:** `UserResponse`

### `POST /api/auth/logout`
Clears session cookie.
- **Response `200`:** `{"message": "Logged out successfully.", "success": true}`

### `GET /api/auth/me`
Returns profile of the authenticated user.
- **Headers:** Requires valid session cookie or `Authorization: Bearer <token>`
- **Response `200`:** `UserResponse`

---

## 3. Order & Payment Lifecycle

### `POST /api/orders`
Creates a pending local order and initiates an authorized Razorpay order.
- **Request:**
  ```json
  {
    "items": [{"product_id": "uuid", "quantity": 2}],
    "email": "customer@example.com",
    "phone": "+919876543210",
    "shipping_address": {
      "full_name": "Dhirali Gandhi",
      "phone": "+919876543210",
      "address_line_1": "123 Boutique Street",
      "city": "Ahmedabad",
      "state": "Gujarat",
      "postal_code": "380015",
      "country": "India"
    }
  }
  ```
- **Response `201`:** `OrderResponse` containing `razorpay_order_id` and server-calculated totals.

### `POST /api/payments/verify`
Validates the cryptographic HMAC-SHA256 signature returned from Razorpay Checkout popup.
- **Request:**
  ```json
  {
    "razorpay_order_id": "order_XXXXX",
    "razorpay_payment_id": "pay_XXXXX",
    "razorpay_signature": "signature_hex"
  }
  ```
- **Response `200`:** `{"success": true, "payment_status": "paid", "order_number": "MBD-..."}`

### `POST /api/webhooks/razorpay`
Asynchronous server-to-server webhook endpoint for payment event reconciliation and deduplication.
- **Headers:** `X-Razorpay-Signature: <hmac>`

---

## 4. Admin Endpoints (`role == 'admin'`)

- `GET /api/admin/dashboard`: Aggregate KPI metrics (total orders, revenue, published products).
- `GET /api/admin/products`: Full product listing including stock and active status.
- `POST /api/admin/products`: Publish a new product item.
- `PUT /api/admin/products/{id}`: Update price, inventory, or description.
- `POST /api/admin/categories`: Create store category.
- `GET /api/admin/orders`: Inspect incoming orders and transaction IDs.
- `PUT /api/admin/orders/{id}/status`: Transition fulfillment status (`processing`, `shipped`, `delivered`).
