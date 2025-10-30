from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_login_returns_token():
    # register a new user
    email = "user1@example.com"
    senha = "a123456"
    client.post("/auth/register", json={"nome": "User 1", "email": email, "senha": senha})

    resp = client.post("/auth/login", json={"email": email, "senha": senha})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data and data["access_token"]
    assert data.get("token_type") == "bearer"
