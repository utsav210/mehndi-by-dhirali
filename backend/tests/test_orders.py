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
            "name": "Henna Bridal Cones Pack",
            "slug": "henna-bridal-cones-pack",
            "category_id": cat_id,
            "description": "Fresh henna cones box",
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
    # Shipping starts with ₹80 (8000 paise)
    assert order_data["shipping_minor"] == 8000
    assert order_data["total_minor"] == 58000
    assert order_data["status"] == "pending_payment"
    assert order_data["order_number"].startswith("MBD-")


def test_create_order_cash_on_delivery(client, admin_headers):
    # Setup product
    cat_res = client.post(
        "/api/admin/categories",
        json={"name": "Henna Powder", "slug": "henna-powder", "sort_order": 2},
        headers=admin_headers,
    )
    prod_res = client.post(
        "/api/admin/products",
        json={
            "name": "100 gm Mehndi Powder",
            "slug": "100-gm-powder-test",
            "category_id": cat_res.json()["id"],
            "description": "Test powder",
            "price_minor": 9900,  # ₹99.00
            "stock_quantity": 30,
            "weight_grams": 100,
            "sku": "MBD-PWD-01",
        },
        headers=admin_headers,
    )
    prod_id = prod_res.json()["id"]

    order_payload = {
        "items": [{"product_id": prod_id, "quantity": 1}],
        "email": "cod.buyer@example.com",
        "phone": "+919876543210",
        "payment_method": "cod",
        "shipping_address": {
            "full_name": "Kavita Rao",
            "phone": "+919876543210",
            "address_line_1": "Sector 14, Ring Road",
            "city": "Ahmedabad",
            "state": "Gujarat",
            "postal_code": "380015",
            "country": "India",
        },
    }

    res = client.post("/api/orders", json=order_payload)
    assert res.status_code == 201
    data = res.json()
    assert data["subtotal_minor"] == 9900
    assert data["shipping_minor"] == 8000  # Base ₹80
    assert data["cod_fee_minor"] == 3000   # COD handling fee ₹30
    assert data["total_minor"] == 9900 + 8000 + 3000  # 20900 (₹209)
    assert data["payment_method"] == "cod"
    assert data["status"] == "confirmed"
    assert data["razorpay_order_id"] is None


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


def test_order_tracking_lifecycle(client, admin_headers):
    # 1. Create a product & place order
    cat_res = client.post(
        "/api/admin/categories",
        json={"name": "Tracking Cones", "slug": "track-cones", "sort_order": 3},
        headers=admin_headers,
    )
    prod_res = client.post(
        "/api/admin/products",
        json={
            "name": "Trackable Cones Box",
            "slug": "trackable-cones-box",
            "category_id": cat_res.json()["id"],
            "description": "Premium cones",
            "price_minor": 9900,
            "stock_quantity": 20,
            "sku": "MBD-TRK-01",
        },
        headers=admin_headers,
    )
    order_res = client.post(
        "/api/orders",
        json={
            "items": [{"product_id": prod_res.json()["id"], "quantity": 1}],
            "email": "bride.tracking@example.com",
            "phone": "+919988776655",
            "shipping_address": {
                "full_name": "Riya Sharma",
                "phone": "+919988776655",
                "address_line_1": "Flat 4B, Lotus Apartments",
                "city": "Jaipur",
                "state": "Rajasthan",
                "postal_code": "302001",
            },
        },
    )
    assert order_res.status_code == 201
    order_data = order_res.json()
    order_id = order_data["id"]
    order_number = order_data["order_number"]

    # 2. Admin updates tracking details: sets status='shipped', tracking_number='DEL123456789', courier='Delhivery Express'
    trk_update = client.put(
        f"/api/admin/orders/{order_id}/tracking",
        json={
            "status": "shipped",
            "tracking_number": "DEL123456789",
            "courier_partner": "Delhivery Express",
            "tracking_url": "https://www.delhivery.com/track/package/DEL123456789",
            "estimated_delivery": "Within 2-3 business days",
            "tracking_notes": "Departed Jaipur Hub",
        },
        headers=admin_headers,
    )
    assert trk_update.status_code == 200
    updated = trk_update.json()
    assert updated["tracking_number"] == "DEL123456789"
    assert updated["courier_partner"] == "Delhivery Express"
    assert updated["status"] == "shipped"

    # 3. Customer tracks order by order_number and email
    track_res = client.get(
        f"/api/orders/track?order_number={order_number}&email_or_phone=bride.tracking@example.com"
    )
    assert track_res.status_code == 200
    track_data = track_res.json()
    assert track_data["order_number"] == order_number
    assert track_data["tracking_number"] == "DEL123456789"
    assert track_data["courier_partner"] == "Delhivery Express"
    assert track_data["status"] == "shipped"
    assert track_data["recipient_name"] == "Riya Sharma"
    assert track_data["destination_city"] == "Jaipur"
    assert len(track_data["timeline"]) == 6
    # Shipped stage should be marked as completed/current
    shipped_step = next(s for s in track_data["timeline"] if s["step_key"] == "shipped")
    assert shipped_step["is_completed"] is True

    # 4. Customer tracks order by tracking_number directly
    track_by_awb = client.get(
        f"/api/orders/track?tracking_number=DEL123456789&email_or_phone=+919988776655"
    )
    assert track_by_awb.status_code == 200
    assert track_by_awb.json()["order_number"] == order_number
