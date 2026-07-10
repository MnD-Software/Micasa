from backend.models.property import Property


class RecommendationEngine:
    """AI-ready ranking service with deterministic fallbacks for local development."""

    def similar_properties(self, source: Property, candidates: list[Property], limit: int = 6) -> list[Property]:
        scored = sorted(
            candidates,
            key=lambda item: (
                item.property_type == source.property_type,
                item.location == source.location,
                item.featured
            ),
            reverse=True
        )
        return [item for item in scored if item.id != source.id][:limit]

    def performance_score(self, property: Property, occupancy_rate: float = 0.72, review_score: float = 4.7) -> float:
        price_signal = min(float(property.price_per_night) / 500, 1)
        return round((occupancy_rate * 0.45 + review_score / 5 * 0.4 + price_signal * 0.15) * 100, 2)
