"""
ParkSense-X ML Service
======================
FastAPI service exposing prediction endpoints for:
- Occupancy demand prediction (XGBoost + LSTM)
- No-show probability classification (Random Forest)
- Congestion prediction
- Parking slot recommendation scoring

All endpoints return a 'data_source' field:
- 'SIMULATED' when using demo/development data
- 'MODEL' when using a trained ML model
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import predictions, recommendations, evaluation

app = FastAPI(
    title="ParkSense-X ML Service",
    description="AI/ML prediction microservice for ParkSense-X intelligent parking platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predictions.router,     prefix="/api/predictions",    tags=["Predictions"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(evaluation.router,      prefix="/api/evaluation",      tags=["Evaluation"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "ParkSense-X ML Service", "version": "1.0.0"}
