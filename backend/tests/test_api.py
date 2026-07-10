from fastapi.testclient import TestClient
from backend.db.session import Base, engine
from backend.main import app


client = TestClient(app)


def setup_function():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def auth_headers(email: str, role: str = "guest") -> dict[str, str]:
    password = "Password123"
    client.post("/api/auth/register", json={"full_name": "Test User", "email": email, "password": password, "role": role})
    response = client.post("/api/auth/login", json={"email": email, "password": password})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_register_and_login():
    response = client.post(
        "/api/auth/register",
        json={"full_name": "Amina Host", "email": "amina@example.com", "password": "Password123", "role": "host"}
    )
    assert response.status_code == 201
    login = client.post("/api/auth/login", json={"email": "amina@example.com", "password": "Password123"})
    assert login.status_code == 200
    assert "access_token" in login.json()


def test_host_can_create_property_and_guest_can_book():
    host_headers = auth_headers("host@example.com", "host")
    prop = client.post(
        "/api/properties",
        headers=host_headers,
        json={
            "title": "Premium Beach House",
            "slug": "premium-beach-house",
            "description": "A beautiful verified home with private access and premium support.",
            "property_type": "Villa",
            "bedrooms": 3,
            "bathrooms": 2,
            "guests": 6,
            "price_per_night": 200,
            "cleaning_fee": 30,
            "service_fee": 20,
            "location": "Diani Beach",
            "featured": True,
            "status": "active",
            "image_urls": ["https://example.com/image.jpg"]
        }
    )
    assert prop.status_code == 201

    guest_headers = auth_headers("guest@example.com")
    booking = client.post(
        "/api/bookings",
        headers=guest_headers,
        json={"property_id": prop.json()["id"], "check_in": "2026-08-01", "check_out": "2026-08-04", "coupon": "WELCOME10"}
    )
    assert booking.status_code == 201
    assert booking.json()["total_amount"] == 590
