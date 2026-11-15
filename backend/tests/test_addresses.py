"""
Tests for customer saved addresses API.
"""
from app.models.user import User
from app.core.security import create_access_token


def test_saved_addresses_crud_flow(client, db_session):
    # 1. Create a customer user
    user = User(
        email="address_test@example.com",
        password_hash="fakehash",
        first_name="Priya",
        last_name="Sharma",
        phone="+919876543210",
        role="customer",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    token = create_access_token(user.id, role="customer")
    cookies = {"access_token": token}

    # 2. Initially empty
    list_res = client.get("/api/addresses", cookies=cookies)
    assert list_res.status_code == 200
    assert list_res.json() == []

    # 3. Create a new address
    payload = {
        "label": "Studio",
        "full_name": "Priya Sharma",
        "phone": "+919876543210",
        "address_line_1": "Flat 301, Lotus Heights",
        "address_line_2": "Near City Center",
        "city": "Ahmedabad",
        "state": "Gujarat",
        "postal_code": "380015",
        "country": "India",
        "is_default": True,
    }
    create_res = client.post("/api/addresses", json=payload, cookies=cookies)
    assert create_res.status_code == 201
    addr_data = create_res.json()
    assert addr_data["label"] == "Studio"
    assert addr_data["city"] == "Ahmedabad"
    assert addr_data["is_default"] is True
    addr_id = addr_data["id"]

    # 4. List addresses - verify it's there
    list_res = client.get("/api/addresses", cookies=cookies)
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1

    # 5. Update the address
    update_res = client.put(
        f"/api/addresses/{addr_id}",
        json={"label": "Main Studio", "postal_code": "382330"},
        cookies=cookies,
    )
    assert update_res.status_code == 200
    assert update_res.json()["label"] == "Main Studio"
    assert update_res.json()["postal_code"] == "382330"

    # 6. Delete address
    del_res = client.delete(f"/api/addresses/{addr_id}", cookies=cookies)
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # 7. Verify list is empty
    list_res2 = client.get("/api/addresses", cookies=cookies)
    assert len(list_res2.json()) == 0


def test_saved_addresses_requires_auth(client):
    res = client.get("/api/addresses")
    assert res.status_code == 401
