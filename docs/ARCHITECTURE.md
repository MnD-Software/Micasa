# Architecture

## Frontend

The frontend uses Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn-style primitives, Framer Motion, React Query, React Hook Form, and Zod. Pages are server-rendered by default, with client components only where interaction is needed.

Key surfaces:

- Homepage with hero search, categories, destinations, featured homes, experiences, and trust modules.
- Property detail pages with gallery, host profile, amenities, map abstraction, reviews, similar homes, and booking widget.
- Guest, host, and admin dashboards.

## Backend

The backend uses FastAPI, SQLAlchemy 2, PostgreSQL-compatible models, JWT auth, role-based dependencies, security headers, repository/service boundaries, and Alembic migrations.

Security posture:

- JWT bearer authentication.
- Role-based authorization for host/admin operations.
- Password hashing with bcrypt.
- SQL injection protection via SQLAlchemy ORM.
- Security headers middleware.
- Redis-ready sessions and logout deny-list support.

## Production Scaling

- Vercel serves frontend static and server-rendered routes.
- Render runs FastAPI workers behind HTTPS.
- PostgreSQL is the system of record.
- Redis supports caching, rate limiting, sessions, and queue coordination.
- Cloudinary handles image storage, transformations, and CDN delivery.
- Stripe and M-Pesa services can plug into the booking payment lifecycle.

## AI Roadmap

- Smart search ranking from listing quality, conversion, distance, availability, and user preferences.
- Similar properties through embeddings and feature vectors.
- Dynamic pricing from occupancy, lead time, seasonality, and comparable listings.
- Revenue prediction and occupancy forecasting via worker jobs.
- Fraud scoring using account, payment, message, and booking features.
