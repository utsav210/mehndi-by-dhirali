"""
Product and Category API tests.
"""
def test_get_categories_empty(client):
    response = client.get("/api/categories")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_list_products_empty(client):
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0


def test_admin_create_category_and_product(client, admin_headers):
    # 1. Create category
    cat_res = client.post(
        "/api/admin/categories",
        json={
            "name": "Henna Cones",
            "slug": "henna-cones",
            "description": "Organic cones",
            "sort_order": 1,
        },
        headers=admin_headers,
    )
    assert cat_res.status_code == 201
    cat_id = cat_res.json()["id"]

    # 2. Create product
    prod_payload = {
        "name": "Premium Sojat Cone",
        "slug": "premium-sojat-cone",
        "category_id": cat_id,
        "description": "Artisanal organic cone with eucalyptus oil.",
        "specifications": "100% natural, 30g",
        "price_minor": 12000,  # ₹120.00
        "compare_at_price_minor": 15000,
        "stock_quantity": 100,
        "is_active": True,
        "is_featured": True,
        "sku": "MBD-CONE-001",
        "weight_grams": 30,
    }
    prod_res = client.post(
        "/api/admin/products",
        json=prod_payload,
        headers=admin_headers,
    )
    assert prod_res.status_code == 201
    prod_data = prod_res.json()
    assert prod_data["price_minor"] == 12000
    assert prod_data["name"] == "Premium Sojat Cone"

    # 3. Verify public product detail
    public_res = client.get("/api/products/premium-sojat-cone")
    assert public_res.status_code == 200
    assert public_res.json()["id"] == prod_data["id"]


def test_unauthorized_user_cannot_create_product(client):
    # Attempt to create product without admin authorization
    response = client.post(
        "/api/admin/products",
        json={
            "name": "Hacked Product",
            "category_id": "none",
            "description": "Unauthorized attempt",
            "price_minor": 100,
            "sku": "HACK-01",
        },
    )
    assert response.status_code in [401, 403]
