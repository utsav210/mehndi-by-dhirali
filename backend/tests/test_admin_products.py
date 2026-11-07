"""
Tests for Admin Product Management and CRUD Operations.
"""
from app.core.security import create_access_token
from app.models.user import User


def test_admin_products_crud_flow(client, db_session):
    # 1. Create an admin user
    admin_user = User(
        email="test_admin@mehndibydhirali.com",
        password_hash="fakehash",
        first_name="Admin",
        last_name="Doe",
        role="admin",
        is_active=True,
    )
    db_session.add(admin_user)
    db_session.commit()
    db_session.refresh(admin_user)

    admin_token = create_access_token(admin_user.id, role="admin")
    cookies = {"access_token": admin_token}

    # 2. List products
    res = client.get("/api/admin/products", cookies=cookies)
    assert res.status_code == 200
    initial_count = len(res.json())

    # 3. Create a new product
    payload = {
        "name": "Henna Piping Bottle 30ml",
        "category_id": "accessories",
        "price_minor": 12000,
        "compare_at_price_minor": 15000,
        "stock_quantity": 40,
        "weight_grams": 45,
        "description": "Ergonomic squeeze bottle for precision henna designs.",
        "image_urls": ["/images/products/pink-bowl-1.jpg"],
    }
    create_res = client.post("/api/admin/products", json=payload, cookies=cookies)
    assert create_res.status_code == 201
    prod_data = create_res.json()
    assert prod_data["name"] == "Henna Piping Bottle 30ml"
    assert prod_data["price_minor"] == 12000
    assert len(prod_data["images"]) == 1
    prod_id = prod_data["id"]

    # 4. Update the product
    update_payload = {
        "price_minor": 11000,
        "stock_quantity": 35,
    }
    update_res = client.put(f"/api/admin/products/{prod_id}", json=update_payload, cookies=cookies)
    assert update_res.status_code == 200
    assert update_res.json()["price_minor"] == 11000
    assert update_res.json()["stock_quantity"] == 35

    # 5. Toggle active status
    toggle_res = client.patch(f"/api/admin/products/{prod_id}/toggle-status?field=is_active", cookies=cookies)
    assert toggle_res.status_code == 200
    assert toggle_res.json()["is_active"] is False

    # 6. Delete the product
    del_res = client.delete(f"/api/admin/products/{prod_id}", cookies=cookies)
    assert del_res.status_code == 200
    assert del_res.json()["deleted"] is True

    # 7. Verify deleted from list
    list_res = client.get("/api/admin/products", cookies=cookies)
    assert len(list_res.json()) == initial_count


def test_customer_cannot_access_admin_products(client, db_session):
    # Customer user without admin role
    customer_user = User(
        email="regular_customer@example.com",
        password_hash="fakehash",
        first_name="Regular",
        last_name="Customer",
        role="customer",
        is_active=True,
    )
    db_session.add(customer_user)
    db_session.commit()
    db_session.refresh(customer_user)

    customer_token = create_access_token(customer_user.id, role="customer")
    cookies = {"access_token": customer_token}

    res = client.get("/api/admin/products", cookies=cookies)
    assert res.status_code == 403
    assert "administrative privileges required" in res.json()["detail"].lower()
