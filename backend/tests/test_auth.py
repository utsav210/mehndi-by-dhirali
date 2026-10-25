"""
Authentication endpoint tests.
"""
def test_register_success(client):
    payload = {
        "email": "dhirali@example.com",
        "password": "SecurePassword123!",
        "first_name": "Dhirali",
        "last_name": "Gandhi",
        "phone": "+919876543210",
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "dhirali@example.com"
    assert data["first_name"] == "Dhirali"
    assert "password_hash" not in data  # Never expose password hash in response
    assert "access_token" in response.cookies


def test_register_duplicate_email(client):
    payload = {
        "email": "duplicate@example.com",
        "password": "Password12345!",
        "first_name": "User",
        "last_name": "One",
    }
    # First registration
    client.post("/api/auth/register", json=payload)

    # Second registration with same email
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


def test_login_success(client):
    # Register first
    client.post("/api/auth/register", json={
        "email": "customer@example.com",
        "password": "Password12345!",
        "first_name": "Customer",
        "last_name": "Test",
    })

    # Login
    response = client.post("/api/auth/login", json={
        "email": "customer@example.com",
        "password": "Password12345!",
    })
    assert response.status_code == 200
    assert "access_token" in response.cookies


def test_login_invalid_password(client):
    client.post("/api/auth/register", json={
        "email": "wrongpass@example.com",
        "password": "CorrectPassword123!",
        "first_name": "Test",
        "last_name": "User",
    })

    response = client.post("/api/auth/login", json={
        "email": "wrongpass@example.com",
        "password": "WrongPassword!",
    })
    assert response.status_code == 401
