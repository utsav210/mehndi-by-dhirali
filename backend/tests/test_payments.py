"""
Razorpay Payment signature verification and webhook idempotency tests.
"""
def test_verify_payment_transitions_order_to_paid(client, admin_headers):
    # 1. Setup product & order
    cat = client.post("/api/admin/categories", json={"name": "Cones", "slug": "cones"}, headers=admin_headers).json()
    prod = client.post("/api/admin/products", json={
        "name": "Fresh Cone",
        "slug": "fresh-cone",
        "category_id": cat["id"],
        "description": "Test cone",
        "price_minor": 12000,
        "stock_quantity": 50,
        "sku": "MBD-CONE-TEST",
    }, headers=admin_headers).json()

    order = client.post("/api/orders", json={
        "items": [{"product_id": prod["id"], "quantity": 1}],
        "email": "test@example.com",
        "phone": "+919876543210",
        "shipping_address": {
            "full_name": "Test User",
            "phone": "+919876543210",
            "address_line_1": "Road 1",
            "city": "City",
            "state": "State",
            "postal_code": "12345",
        },
    }).json()

    rzp_order_id = order["razorpay_order_id"]

    # 2. Verify payment
    verify_res = client.post("/api/payments/verify", json={
        "razorpay_order_id": rzp_order_id,
        "razorpay_payment_id": "pay_mock_12345",
        "razorpay_signature": "mock_signature_valid",
    })
    assert verify_res.status_code == 200
    assert verify_res.json()["success"] is True
    assert verify_res.json()["payment_status"] == "paid"

    # 3. Repeated verification check (idempotency: does not fail, stays paid)
    repeat_res = client.post("/api/payments/verify", json={
        "razorpay_order_id": rzp_order_id,
        "razorpay_payment_id": "pay_mock_12345",
        "razorpay_signature": "mock_signature_valid",
    })
    assert repeat_res.status_code == 200
    assert repeat_res.json()["success"] is True
    assert "already verified" in repeat_res.json()["message"].lower()


def test_verify_nonexistent_order_fails(client):
    res = client.post("/api/payments/verify", json={
        "razorpay_order_id": "order_non_existent",
        "razorpay_payment_id": "pay_123",
        "razorpay_signature": "sig_123",
    })
    assert res.status_code == 404
