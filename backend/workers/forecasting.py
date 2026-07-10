def forecast_occupancy(previous_30_days: list[float]) -> dict[str, float]:
    if not previous_30_days:
        return {"next_30_days": 0.68, "confidence": 0.52}
    average = sum(previous_30_days) / len(previous_30_days)
    return {"next_30_days": round(min(max(average * 1.03, 0), 1), 2), "confidence": 0.74}
