from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


def test_list_planos():
    resp = client.get("/planos")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

