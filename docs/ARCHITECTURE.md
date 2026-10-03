# ParkSense-X — System Architecture

## Overview

ParkSense-X is a three-tier intelligent parking platform:

```
Frontend (React + TypeScript)
         ↕ REST / WebSocket
Backend (Spring Boot 3 / Java 21)
         ↕ REST
ML Service (Python / FastAPI)
         ↕ JPA / JDBC
Database (MySQL 8)
```

## Services

| Service      | Technology          | Port | Purpose                            |
|-------------|---------------------|------|------------------------------------|
| Frontend    | React + Vite + TS   | 3000 | SPA user interface                 |
| Backend     | Spring Boot 3 / JDK21 | 8080 | REST API, auth, booking, WebSocket |
| ML Service  | Python / FastAPI    | 8001 | AI/ML predictions, recommendations |
| Database    | MySQL 8.0           | 3306 | Persistent data store              |

## Key Architecture Decisions

### Demo Mode
All services have a demo/simulation mode:
- Frontend: Mock auth, demo data from `demoData.ts`
- ML Service: Returns simulated predictions with `data_source: "SIMULATED"`
- Backend: Seed data loaded from `seed.sql`

All simulated data is clearly labelled with **⚡ SIMULATION DATA** banners.

### Real-Time Updates
WebSocket via Spring Boot STOMP:
- `/topic/slots/{facilityId}` — slot status changes
- `/topic/occupancy/{facilityId}` — occupancy updates
- `/topic/notifications/{userId}` — user notifications
- `/topic/operator/{facilityId}` — operator alerts

### AI/ML Pipeline
```
Raw occupancy data → Feature engineering → XGBoost/LSTM model
                                          ↓
                              Demand prediction (15m/30m/60m)
                                          ↓
                              Multi-objective optimizer
                                          ↓
                              Slot recommendation (suitability score)
```

### Digital Twin
The Digital Twin is the central concept — a live virtual model of the parking facility.
State changes flow:
```
Physical event → Sensor/QR scan → Backend API → WebSocket broadcast → Frontend Digital Twin update
```
In demo mode, the simulation engine generates events at configurable intervals.

## Security

- JWT Bearer tokens (HMAC-SHA256, 24h expiry)
- Role-based authorization: DRIVER / OPERATOR / ADMIN
- BCrypt password hashing (strength 12)
- CORS restricted to frontend origins
- Input validation via Bean Validation
- Global exception handler with sanitized error responses

## Database Design Principles

- All relationships enforced with foreign keys
- Soft-delete pattern where applicable (enabled flag on users)
- Indexed columns: facility_id, status, email, booking_ref
- Temporal tables for occupancy history and predictions

## Folder Structure

```
JAVA_PROJECT/
├── frontend/         React + TypeScript SPA
│   └── src/
│       ├── components/   Reusable UI components
│       ├── pages/        Route-level page components
│       ├── layouts/      Layout wrappers
│       ├── store/        Zustand state management
│       ├── services/     API + demo data services
│       ├── types/        TypeScript type definitions
│       └── lib/          Utility functions
├── backend/          Spring Boot REST API
│   └── src/main/java/com/parksensex/backend/
│       ├── controllers/  REST endpoints
│       ├── services/     Business logic
│       ├── repositories/ JPA repositories
│       ├── models/       JPA entities
│       ├── dto/          Request/Response DTOs
│       ├── security/     JWT, filters
│       └── config/       Spring configuration
├── ml-service/       Python FastAPI ML microservice
│   └── app/
│       ├── api/          Endpoint routers
│       ├── models/       ML model wrappers
│       ├── prediction/   Prediction logic
│       ├── features/     Feature engineering
│       └── evaluation/   Metrics computation
├── database/         SQL schema and seed data
├── docker/           Docker Compose configuration
└── docs/             Architecture and API documentation
```
