# StayForge Property Rental Marketplace

StayForge is a production-oriented property rental marketplace inspired by the usability standards of Airbnb without copying its brand or interface. The repo is split into a Next.js App Router frontend and a FastAPI backend with SQLAlchemy models, JWT authentication, booking APIs, messaging, reviews, and AI-ready recommendation services.

## Quick Start

```powershell
npm.cmd --prefix frontend install
npm.cmd --prefix frontend run dev
```

Frontend: `http://localhost:3000`

Backend:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`

## Production Targets

- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL
- Cache and sessions: Redis
- Media: Cloudinary
- Payments: Stripe and M-Pesa integration seams
- Maps: Google Maps API with Mapbox-ready map abstraction

See [docs/API.md](docs/API.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
