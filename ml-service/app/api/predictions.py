"""
Prediction API endpoints.
All predictions are clearly labelled as SIMULATED in demo mode.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import random
import math
from datetime import datetime, timedelta

router = APIRouter()


class DemandPredictionRequest(BaseModel):
    facility_id: int
    horizon_minutes: int = 60  # 15, 30, 60, 180, 360, 1440
    current_occupancy: Optional[float] = None
    time_of_day: Optional[str] = None
    day_of_week: Optional[int] = None


class DemandPredictionResponse(BaseModel):
    facility_id: int
    horizon_minutes: int
    predicted_occupancy: float
    confidence: float
    is_peak_period: bool
    data_source: str = "SIMULATED"
    model_used: str = "XGBoost (demo)"
    timestamp: str


class NoShowPredictionRequest(BaseModel):
    booking_id: int
    user_id: int
    facility_id: int
    booking_lead_hours: float
    duration_minutes: int
    user_historical_noshow_rate: Optional[float] = 0.1
    user_cancellation_count: Optional[int] = 0


class NoShowPredictionResponse(BaseModel):
    booking_id: int
    probability: float
    risk_level: str   # LOW, MEDIUM, HIGH
    factors: list
    data_source: str = "SIMULATED"


@router.post("/demand", response_model=DemandPredictionResponse)
def predict_demand(req: DemandPredictionRequest):
    """
    Predict parking occupancy for a given horizon.
    In demo mode, uses a realistic simulation formula based on time-of-day patterns.
    """
    base_pattern = [12, 10, 8, 8, 11, 22, 42, 62, 75, 80, 82, 79,
                    72, 67, 70, 76, 82, 88, 85, 74, 58, 40, 26, 16]
    now = datetime.now()
    future_time = now + timedelta(minutes=req.horizon_minutes)
    hour = future_time.hour

    base_occupancy = base_pattern[hour]
    noise = random.uniform(-3, 3)
    trend = min(req.horizon_minutes / 60 * 2, 8)  # slight upward trend
    predicted = min(100.0, max(0.0, base_occupancy + noise + trend))

    # Confidence decreases with longer horizon
    confidence = max(60.0, 95.0 - (req.horizon_minutes / 1440) * 35)

    is_peak = 7 <= hour <= 9 or 17 <= hour <= 20

    return DemandPredictionResponse(
        facility_id=req.facility_id,
        horizon_minutes=req.horizon_minutes,
        predicted_occupancy=round(predicted, 1),
        confidence=round(confidence, 1),
        is_peak_period=is_peak,
        timestamp=future_time.isoformat(),
    )


@router.post("/noshow", response_model=NoShowPredictionResponse)
def predict_noshow(req: NoShowPredictionRequest):
    """
    Predict no-show probability for a booking.
    Uses feature-weighted scoring with realistic factors.
    """
    # Weighted feature scoring — demo simulation
    features = []

    # Lead time (booked far in advance → higher risk)
    lead_score = min(req.booking_lead_hours / 48, 1.0) * 0.3
    features.append({
        "name": "Booking lead time",
        "impact": "NEGATIVE" if req.booking_lead_hours > 12 else "POSITIVE",
        "weight": 0.30,
        "description": f"Booked {req.booking_lead_hours:.1f}h in advance",
    })

    # Historical no-show rate
    hist_score = req.user_historical_noshow_rate * 0.4
    features.append({
        "name": "Historical no-show rate",
        "impact": "NEGATIVE" if req.user_historical_noshow_rate > 0.15 else "POSITIVE",
        "weight": 0.40,
        "description": f"User no-show rate: {req.user_historical_noshow_rate * 100:.0f}%",
    })

    # Cancellations
    cancel_score = min(req.user_cancellation_count / 5, 1.0) * 0.3
    features.append({
        "name": "Previous cancellations",
        "impact": "NEGATIVE" if req.user_cancellation_count > 1 else "POSITIVE",
        "weight": 0.30,
        "description": f"{req.user_cancellation_count} cancellations in last 30 days",
    })

    raw_probability = (lead_score + hist_score + cancel_score) * 100
    probability = min(95.0, max(5.0, raw_probability + random.uniform(-5, 5)))

    risk_level = "HIGH" if probability >= 60 else "MEDIUM" if probability >= 30 else "LOW"

    return NoShowPredictionResponse(
        booking_id=req.booking_id,
        probability=round(probability, 1),
        risk_level=risk_level,
        factors=features,
    )
