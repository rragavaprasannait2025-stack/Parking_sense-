"""
Recommendation API — multi-objective slot scoring.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter()


class SlotCandidate(BaseModel):
    slot_id: int
    slot_code: str
    floor: int
    zone: str
    price_per_hour: float
    distance_to_entrance: float   # metres
    has_ev_charger: bool
    is_accessible: bool
    is_covered: bool
    near_elevator: bool
    current_status: str


class RecommendationRequest(BaseModel):
    facility_id: int
    user_preference: str = "balanced"  # balanced, cheapest, closest, fastest, greenest
    candidates: List[SlotCandidate]
    max_price: Optional[float] = None
    require_ev: bool = False
    require_accessible: bool = False


class ScoredSlot(BaseModel):
    slot_id: int
    slot_code: str
    suitability_score: float
    factor_scores: dict
    explanation: str
    data_source: str = "SIMULATED"


@router.post("/slots", response_model=List[ScoredSlot])
def recommend_slots(req: RecommendationRequest):
    """
    Multi-objective slot recommendation engine.
    Returns ranked list of slots with suitability scores and explanations.
    """
    weights = _get_weights(req.user_preference)
    scored = []

    available = [s for s in req.candidates if s.current_status == "AVAILABLE"]
    if req.require_ev:
        available = [s for s in available if s.has_ev_charger]
    if req.require_accessible:
        available = [s for s in available if s.is_accessible]
    if req.max_price:
        available = [s for s in available if s.price_per_hour <= req.max_price]

    if not available:
        available = [s for s in req.candidates if s.current_status == "AVAILABLE"]

    all_prices = [s.price_per_hour for s in available] or [1]
    all_distances = [s.distance_to_entrance for s in available] or [1]
    max_price = max(all_prices)
    max_dist  = max(all_distances)

    for slot in available:
        price_score    = (1 - slot.price_per_hour / max_price) * 100
        dist_score     = (1 - slot.distance_to_entrance / max_dist) * 100
        avail_score    = random.uniform(85, 98)
        congestion_score = random.uniform(75, 95)
        carbon_score   = dist_score * 0.9 + (5 if slot.is_covered else 0)
        ev_bonus       = 5 if slot.has_ev_charger and req.user_preference != "cheapest" else 0

        factor_scores = {
            "availability":     round(avail_score, 1),
            "distance":         round(dist_score, 1),
            "price":            round(price_score, 1),
            "congestion":       round(congestion_score, 1),
            "walking_distance": round(dist_score * 0.95, 1),
            "carbon_impact":    round(carbon_score, 1),
        }

        suitability = (
            factor_scores["availability"]     * weights["availability"]
            + factor_scores["distance"]       * weights["distance"]
            + factor_scores["price"]          * weights["price"]
            + factor_scores["congestion"]     * weights["congestion"]
            + factor_scores["walking_distance"] * weights["walking"]
            + factor_scores["carbon_impact"]  * weights["carbon"]
        ) + ev_bonus

        explanation = _generate_explanation(slot, factor_scores, req.user_preference)

        scored.append(ScoredSlot(
            slot_id=slot.slot_id,
            slot_code=slot.slot_code,
            suitability_score=round(min(100, suitability), 1),
            factor_scores=factor_scores,
            explanation=explanation,
        ))

    scored.sort(key=lambda x: x.suitability_score, reverse=True)
    return scored[:5]


def _get_weights(preference: str) -> dict:
    base = {"availability": 0.25, "distance": 0.20, "price": 0.20, "congestion": 0.15, "walking": 0.10, "carbon": 0.10}
    if preference == "cheapest":
        base.update({"price": 0.40, "availability": 0.25, "distance": 0.15, "carbon": 0.05, "walking": 0.05, "congestion": 0.10})
    elif preference == "closest":
        base.update({"distance": 0.40, "walking": 0.20, "availability": 0.20, "price": 0.10, "carbon": 0.05, "congestion": 0.05})
    elif preference == "greenest":
        base.update({"carbon": 0.35, "distance": 0.25, "availability": 0.20, "price": 0.10, "congestion": 0.05, "walking": 0.05})
    return base


def _generate_explanation(slot: SlotCandidate, factors: dict, mode: str) -> str:
    top_factor = max(factors, key=factors.get)
    names = {"availability": "availability", "distance": "distance", "price": "price", "carbon_impact": "carbon impact"}
    return (
        f"Slot {slot.slot_code} is recommended based on your {mode} preference. "
        f"Highest scoring factor: {names.get(top_factor, top_factor)} ({factors[top_factor]:.0f}/100). "
        f"{'EV charging available. ' if slot.has_ev_charger else ''}"
        f"{'Near elevator. ' if slot.near_elevator else ''}"
        f"Price: ₹{slot.price_per_hour}/hr."
    )
