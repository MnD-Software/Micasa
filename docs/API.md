# API Documentation

Base URL: `/api`

## Authentication

- `POST /api/auth/register` creates guest, host, or admin users.
- `POST /api/auth/login` returns a JWT bearer token.
- `POST /api/auth/logout` is stateless and ready for Redis deny-list support.

## Properties

- `GET /api/properties`
- `GET /api/properties/{id}`
- `POST /api/properties` requires host or admin JWT.
- `PUT /api/properties/{id}` requires owner or admin JWT.
- `DELETE /api/properties/{id}` requires owner or admin JWT.

## Bookings

- `GET /api/bookings` returns current user bookings or all bookings for admins.
- `POST /api/bookings` calculates nights, service fees, cleaning fees, and coupon discounts.
- `PUT /api/bookings/{id}` updates booking and payment status.

## Reviews and Messages

- `GET /api/reviews`
- `POST /api/reviews`
- `GET /api/messages`
- `POST /api/messages`

## AI-ready Intelligence

- `GET /api/ai/properties/{id}/similar`
- `GET /api/ai/properties/{id}/score`

The recommendation service is deterministic today and can be replaced with embeddings, feature stores, or model-backed ranking without changing route contracts.
