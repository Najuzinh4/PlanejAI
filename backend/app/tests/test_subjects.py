from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def _auth_headers():
    email = "subj@example.com"
    senha = "abc12345"
    client.post("/auth/register", json={"nome": "User Subj", "email": email, "senha": senha})
    resp = client.post("/auth/login", json={"email": email, "senha": senha})
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_subjects_crud():
    h = _auth_headers()
    # create
    payload = {"nome": "Calculo I", "horas_por_semana": 6, "dificuldade": "media"}
    r = client.post("/subjects", json=payload, headers=h)
    assert r.status_code == 201
    subj = r.json()
    sid = subj["id_disciplina"]

    # list
    r = client.get("/subjects", headers=h)
    assert r.status_code == 200
    lst = r.json()
    assert any(s["id_disciplina"] == sid for s in lst)

    # update
    r = client.put(f"/subjects/{sid}", json={"dificuldade": "alta"}, headers=h)
    assert r.status_code == 200
    assert r.json()["dificuldade"] == "alta"

    # delete
    r = client.delete(f"/subjects/{sid}", headers=h)
    assert r.status_code == 204

    # list again
    r = client.get("/subjects", headers=h)
    assert r.status_code == 200
    lst = r.json()
    assert all(s["id_disciplina"] != sid for s in lst)
