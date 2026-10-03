"""
Model evaluation metrics endpoint — for academic comparison dashboard.
Returns pre-computed simulation metrics for XGBoost, LSTM, Random Forest, and baseline.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class ModelMetrics(BaseModel):
    model_name: str
    task: str
    mae: Optional[float] = None
    rmse: Optional[float] = None
    mape: Optional[float] = None
    accuracy: Optional[float] = None
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1: Optional[float] = None
    last_trained: str
    data_points: int
    status: str
    drift_score: float
    data_source: str = "SIMULATED"
    notes: str = ""


@router.get("/models", response_model=List[ModelMetrics])
def get_model_metrics():
    """
    Returns evaluation metrics for all trained models.
    These are SIMULATION values from demo training experiments.
    """
    return [
        ModelMetrics(
            model_name="XGBoost Demand Predictor",
            task="Occupancy Demand Prediction",
            mae=3.24, rmse=4.81, mape=4.2,
            last_trained="2026-08-20T08:00:00",
            data_points=42000, status="HEALTHY", drift_score=12.0,
            notes="Best performer for short-horizon predictions (15–60 min)",
        ),
        ModelMetrics(
            model_name="LSTM Sequence Model",
            task="Short-term Occupancy Prediction",
            mae=2.91, rmse=4.12, mape=3.7,
            last_trained="2026-08-18T10:30:00",
            data_points=38000, status="HEALTHY", drift_score=18.0,
            notes="Better on sequential patterns, requires more training data",
        ),
        ModelMetrics(
            model_name="Random Forest No-Show",
            task="No-Show Probability Classification",
            accuracy=87.4, precision=84.1, recall=81.2, f1=82.6,
            last_trained="2026-08-15T14:00:00",
            data_points=15200, status="HEALTHY", drift_score=24.0,
            notes="Trained on booking history with 12 features",
        ),
        ModelMetrics(
            model_name="Linear Regression (Baseline)",
            task="Occupancy Demand Prediction",
            mae=8.42, rmse=11.34, mape=11.8,
            last_trained="2026-08-01T08:00:00",
            data_points=42000, status="DEGRADED", drift_score=62.0,
            notes="Baseline comparison — significantly worse than tree-based models",
        ),
        ModelMetrics(
            model_name="Random Allocation (Baseline)",
            task="Slot Recommendation",
            mae=None, rmse=None, mape=None,
            accuracy=None, precision=None, recall=None, f1=None,
            last_trained="2026-08-01T08:00:00",
            data_points=0, status="DEGRADED", drift_score=100.0,
            notes="Random slot assignment — used as lower-bound baseline",
        ),
    ]
