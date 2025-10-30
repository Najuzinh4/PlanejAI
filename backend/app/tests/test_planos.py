from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def _login(email: str, senha: str) -> str:
    # Ensure user exists
    client.post("/auth/register", json={"nome": "User T", "email": email, "senha": senha})
    resp = client.post("/auth/login", json={"email": email, "senha": senha})
    assert resp.status_code == 200
    return resp.json()["access_token"]


def test_list_planos():
    token = _login("p1@example.com", "abc12345")
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get("/planos", headers=headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
