# ParkSense-X

**Predictive Digital Twin and Multi-Objective AI Framework for Intelligent Parking Allocation**

> Final-Year Information Technology Project — Complete Demo Build

---

## Project Status: COMPLETE AND RUNNING

```
FRONTEND URL: http://localhost:3000
BACKEND:      Demo mode (no backend required to run the full frontend)
```

---

## Quick Start — 3 Commands

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Open **http://localhost:3000**

---

## Demo Accounts

All use password: `Demo1234`

| Role     | Email               | Access Level                                    |
|----------|---------------------|-------------------------------------------------|
| Driver   | driver@demo.com     | Search, AI Recommend, Book, QR Pass, Carbon     |
| Operator | operator@demo.com   | Digital Twin, Forecast, Simulator, Pricing      |
| Admin    | admin@demo.com      | Full Platform, ML Models, Users, Audit Logs     |

---

## What Is Built

### Public Website (6 pages)
- **Home** — Full hero, problem section, features, how it works, for drivers, for operators, sustainability, CTA
- **About** — Intelligence loop, architecture, tech stack
- **FAQ** — Common questions with accordion layout
- **Contact** — Working contact form
- **Privacy Policy** / **Terms & Conditions**

### Auth System
- Login with demo accounts (mock JWT)
- Register (creates real local session)
- Role-based routing (DRIVER / OPERATOR / ADMIN)
- Persistent session via localStorage

### Driver Portal (10 pages)
- **Dashboard** — Upcoming booking, AI recommendation, nearby facilities, carbon stats
- **Search** — Filter by price, EV, accessibility; List + SVG map view; optimization modes
- **Facility Detail** — Interactive slot grid, demand forecast, floor/zone breakdown
- **AI Recommendation** — Multi-objective scoring with full explainability
- **Book & QR Pass** — Complete booking flow; real QR code generated via qrcode.react
- **My Bookings** — Upcoming + history tabs; full QR pass modal
- **Saved Places** — Save/tag facilities; 1-click booking
- **Carbon Impact** — Eco stats, monthly trend chart, achievements, eco mode toggle
- **AI Assistant** — Chat-based parking concierge with context-aware responses
- **Preferences** — Optimization mode, EV/accessible filters, notification settings
- **Notifications** — Priority-filtered notification center, mark read/delete

### Operator Portal (13 pages)
- **Dashboard** — KPIs, occupancy + revenue charts, facility status, no-show alerts
- **Digital Twin** — Live slot map, simulation engine, event log, intelligence loop status
- **Live Occupancy** — Floor/zone breakdown, real-time telemetry stream, live sparkline
- **Demand Forecast** — Actual vs predicted chart, multi-horizon table, feature importance
- **Congestion** — Per-facility horizon matrix, hourly pattern chart
- **No-Show Risk** — Risk cards with factor analysis, weekly trend, model metrics
- **What-If Simulator** — 8 scenario types, 3-state comparison, chart, recommendations
- **Dynamic Pricing** — Recommendations with apply button, price vs demand chart
- **Optimization** — Mode selector, radar chart, objective scores, weight visualization
- **Reservations** — Gate check-in/out simulation, QR viewer, no-show enforcement
- **Facilities** — Floor/zone breakdown, edit rates and status
- **Analytics** — 24h occupancy, 30-day revenue, weekly/hourly patterns, pie chart, ML table
- **Sustainability** — CO₂ trend, by-facility comparison, optimized vs baseline stats

### Admin Panel (10 pages)
- **Dashboard** — Platform stats, quick nav, recent users table
- **Users** — Full CRUD: create, filter, change role, delete
- **Operators** — Facility-operator assignment matrix
- **Facilities** — Provision new facilities with modal form
- **Zones & Slots** — Create zones, set types and multipliers
- **Pricing Rules** — Guardrails (min/max) + automated multiplier rules
- **ML Models** — Health cards, drift scores, retrain button
- **Model Evaluation** — Radar benchmark, confusion matrix, training loss chart
- **Audit Logs** — Full trail, filter by action, JSON export
- **Settings** — Simulation controls, API endpoints, cache reset

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  React 18 + TypeScript + Vite + Tailwind CSS         │
│  Zustand (auth) · React Query · React Router 6       │
│  Recharts · qrcode.react · Framer Motion             │
│  lucide-react · react-hot-toast · date-fns           │
└───────────────┬─────────────────────────────────────┘
                │ REST (proxied)
┌───────────────▼────────────────┐
│  Spring Boot 3.3 / Java 21     │  ← pom.xml configured
│  Spring Security (JWT)         │
│  JPA + MySQL 8.0               │
│  STOMP WebSocket               │
└───────────────┬────────────────┘
                │ HTTP
┌───────────────▼────────────────┐
│  FastAPI / Python 3.11         │  ← ml-service/
│  XGBoost · scikit-learn        │
│  No-show classifier            │
│  Multi-objective recommender   │
└────────────────────────────────┘
```

---

## Intelligence Loop

```
OBSERVE → sensors/bookings update Digital Twin
PREDICT → XGBoost/LSTM forecast occupancy 15–60 min
SIMULATE → What-If Simulator models scenarios
OPTIMIZE → Multi-objective slot scorer runs
ACT → QR admission + dynamic pricing triggered
LEARN → Feedback data used for model retraining
```

---

## Key Research Contributions

1. **Predictive Digital Twin** — Not just current occupancy but predicted future state
2. **Multi-Objective Optimization** — 6 simultaneous objectives (cost, distance, congestion, carbon, availability, utilization) with user-configurable weights
3. **Explainable AI Recommendations** — Every recommendation shows factor scores and natural-language justification
4. **No-Show Risk Classification** — Random Forest classifier predicts which reservations will become no-shows
5. **What-If Simulation** — Operators can model policy changes before implementing them
6. **Carbon-Aware Allocation** — Every booking includes estimated CO₂ impact and eco optimization option

---

## Tech Stack Summary

| Layer       | Technology                                  |
|-------------|---------------------------------------------|
| Frontend    | React 18, TypeScript, Vite, Tailwind CSS    |
| Charts      | Recharts (AreaChart, BarChart, RadarChart)  |
| State       | Zustand + localStorage persistence         |
| QR Code     | qrcode.react (real QR generation)          |
| Backend     | Spring Boot 3.3, Java 21, Spring Security  |
| Database    | MySQL 8.0, Hibernate JPA                   |
| ML Service  | FastAPI, Python 3.11, XGBoost, scikit-learn|
| Auth        | JWT (demo mode: local mock JWT)            |
| Deployment  | Docker + Docker Compose (docker/ folder)   |

---

## Running with Backend

### Configure database credentials
```
backend/src/main/resources/application.properties
```

### Run Spring Boot
```bash
cd backend
./mvnw spring-boot:run
```

### Run ML Service
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### Full Stack with Docker
```bash
cd docker
docker-compose up -d
```

---

## Data Notice

⚡ **SIMULATION DATA** — All ML predictions, IoT sensor events, analytics, and carbon calculations in demo mode are generated by the ParkSense-X simulation engine. They do not represent real sensor measurements or live data. Every simulated value is clearly labeled throughout the interface.

---

## How to Stop

Stop the dev server: press `Ctrl+C` in the terminal running `npm run dev`

## How to Start Again

```bash
cd frontend
npm run dev
```

---

*Final-Year B.Tech / B.E. IT Project · ParkSense-X · 2026*
