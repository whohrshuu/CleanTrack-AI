# CleanTrack AI 🌱

CleanTrack AI is an enterprise-grade, eco-modern smart city platform built to revolutionize municipal waste management. It connects citizens, sanitation workers, and government administrators in a seamless, real-time ecosystem.

## 🚀 Features

### For Citizens
* **Smart Reporting:** Report waste and infrastructure issues with geospatial tagging.
* **Real-time Tracking:** Track the lifecycle of your complaint from submission to resolution.
* **Eco-Rewards:** Gamified reward system with badges and city-wide leaderboards for civic engagement.

### For Sanitation Workers
* **Dynamic Task Queue:** Automated, proximity-based task routing with SLA deadlines.
* **Field Execution:** Upload completion proof (before/after images) directly from the field.
* **Shift Management:** Seamlessly toggle on/off duty with performance tracking.

### For Administrators & Government
* **Live Operations Dashboard:** Monitor city-wide health, SLAs, and zone performance.
* **AI Fraud Detection:** Automated duplicate and fake complaint flagging.
* **Escalation Center:** Automated routing of overdue tasks to higher authorities.

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite, Zustand, Tailwind CSS v4, Motion (Framer), Recharts, Leaflet
* **Backend:** Java 21, Spring Boot 3.4, Spring Security (JWT), Spring Data JPA, Flyway
* **Database:** PostgreSQL
* **Infrastructure:** Docker, Docker Compose, Render (Infrastructure as Code)

## 📦 Project Structure

```
cleantrack-ai/
├── backend/            # Spring Boot REST API
├── frontend/           # React + Vite Frontend
├── render.yaml         # Render Deployment Blueprint
└── docker-compose.yml  # Local Development Environment
```

## 💻 Local Development

### Prerequisites
* Java 21
* Node.js 20+
* Docker Desktop (for Postgres)

### 1. Start the Database
```bash
docker-compose up -d
```

### 2. Start the Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## ☁️ Deployment (Render)

This repository includes a `render.yaml` Blueprint which enables zero-configuration, one-click deployments to Render.com.

1. Fork or push this repository to your GitHub account.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **Blueprint**.
3. Connect your repository. Render will automatically provision:
   * A PostgreSQL database (`cleantrack-db`)
   * A Spring Boot web service (`cleantrack-api`)
   * A React static site (`cleantrack-ai`)

All environment variables and database connections are automatically injected via the blueprint.

---
*Built as a portfolio demonstration of enterprise full-stack development.*
