from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def _headers():
    email = "pcreate@example.com"
    senha = "abc12345"
    client.post("/auth/register", json={"nome": "User P", "email": email, "senha": senha})
    token = client.post("/auth/login", json={"email": email, "senha": senha}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_plan_with_ai_mock():
    h = _headers()
    resp = client.post(
        "/planos",
        json={
            "subject_names": ["Matematica"],
            "horas_por_semana": 6,
            "dificuldade": "media",
            "objetivo": "melhorar base",
            "periodo": "2025-01",
            "timeframe_weeks": 4,
        },
        headers=h,
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["id_pe"] > 0
    assert data["id_usuario"] > 0
    # items should be created from mock plan text
    assert isinstance(data.get("itens", []), list)
    assert len(data.get("itens", [])) > 0

