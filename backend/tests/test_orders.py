"""
Order placement and server-authoritative pricing tests.
"""
def test_create_order_pricing_calculated_by_server(client, admin_headers):
    # 1. Admin creates product in DB
    cat_res = client.post(
        "/api/admin/categories",
        json={"name": "Oils", "slug": "oils", "sort_order": 1},
        headers=admin_headers,
    )
    cat_id = cat_res.json()["id"]

    prod_res = client.post(
        "/api/admin/products",
        json={
            "name": "Eucalyptus Aftercare Oil",
            "slug": "eucalyptus-oil",
            "category_id": cat_id,
            "description": "Pure aftercare oil",
            "price_minor": 25000,  # ₹250.00
            "stock_quantity": 20,
            "sku": "MBD-OIL-01",
        },
        headers=admin_headers,
    )
    prod_id = prod_res.json()["id"]

    # 2. Customer places order for 2 units
    order_payload = {
        "items": [{"product_id": prod_id, "quantity": 2}],
        "email": "bride@example.com",
        "phone": "+919876543210",
        "shipping_address": {
            "full_name": "Pooja Patel",
            "phone": "+919876543210",
            "address_line_1": "123 Heritage Lane",
            "city": "Ahmedabad",
            "state": "Gujarat",
            "postal_code": "380015",
            "country": "India",
        },
    }

    order_res = client.post("/api/orders", json=order_payload)
    assert order_res.status_code == 201
    order_data = order_res.json()

    # Subtotal must be strictly 2 * 25000 = 50000 paise (₹500.00)
    assert order_data["subtotal_minor"] == 50000
    # Shipping for orders < ₹999 is ₹70 (7000 paise)
    assert order_data["shipping_minor"] == 7000
    assert order_data["total_minor"] == 57000
    assert order_data["status"] == "pending_payment"
    assert order_data["order_number"].startswith("MBD-")


def test_cannot_order_exceeding_stock(client, admin_headers):
    cat_res = client.post(
        "/api/admin/categories",
        json={"name": "Kits", "slug": "kits", "sort_order": 2},
        headers=admin_headers,
    )
    prod_res = client.post(
        "/api/admin/products",
        json={
            "name": "Limited Bridal Kit",
            "slug": "limited-kit",
            "category_id": cat_res.json()["id"],
            "description": "Exclusive kit",
            "price_minor": 150000,
            "stock_quantity": 2,  # Only 2 available
            "sku": "MBD-KIT-01",
        },
        headers=admin_headers,
    )

    # Attempt to order 5 units
    res = client.post(
        "/api/orders",
        json={
            "items": [{"product_id": prod_res.json()["id"], "quantity": 5}],
            "email": "test@example.com",
            "phone": "+919876543210",
            "shipping_address": {
                "full_name": "Test User",
                "phone": "+919876543210",
                "address_line_1": "Street",
                "city": "City",
                "state": "State",
                "postal_code": "12345",
            },
        },
    )
    assert res.status_code == 400
    assert "insufficient stock" in res.json()["detail"].lower()
