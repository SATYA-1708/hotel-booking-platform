# 🏨 GrandStay — Fullstack Hotel Booking Platform
## Complete Setup & Run Instructions

This repository contains a full-stack hotel reservation, inventory, and analytics platform built with **React (Vite + Tailwind CSS)** and **Node.js (Express + TypeScript + MongoDB)**.

---

## 📁 Project Architecture

```
hotel-booking-platform/
├── hotel-booking-backend/    # Express + TypeScript REST API
├── hotel-booking-frontend/   # React + Vite + Tailwind CSS SPA
├── shared/                   # Shared TypeScript interfaces & types
├── data/                     # Hotel asset datasets
├── report-assets/            # Documentation & architecture screenshots
└── RUN_INSTRUCTIONS.md       # This guide
```

---

## ⚙️ Prerequisites

Before running the application locally, ensure you have installed:
1. **Node.js**: `v18.0.0` or higher (`node -v`)
2. **npm**: `v9.0.0` or higher (`npm -v`)
3. **MongoDB**: Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` **OR** a free MongoDB Atlas cloud URI.

---

## 🚀 Step 1: Start the Backend API

Open your terminal (PowerShell, Command Prompt, or Bash):

```bash
# 1. Navigate to backend directory
cd hotel-booking-backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example to .env (if .env doesn't already exist)
cp .env.example .env
```

### Backend `.env` Configuration
Your `hotel-booking-backend/.env` should contain:
```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5175
BACKEND_URL=http://localhost:5001
MONGODB_CONNECTION_STRING=mongodb://127.0.0.1:27017/hotel-booking
JWT_SECRET_KEY=development_hotel_booking_jwt_secret_key_123456789
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=demo
CLOUDINARY_API_SECRET=demo
STRIPE_API_KEY=placeholder
AI_ASSIST_ENABLED=false
```
*(If using MongoDB Atlas, replace `MONGODB_CONNECTION_STRING` with your `mongodb+srv://...` URI).*

### Run the Backend Server
```bash
npm run dev
```
* **API Running at**: `http://localhost:5001`
* **Interactive Swagger API Docs**: `http://localhost:5001/api-docs`
* **Health Check**: `http://localhost:5001/api/health`

> **Note**: On initial startup, the backend automatically seeds default hotels and demo accounts if the database is empty.

---

## 🎨 Step 2: Start the Frontend Application

Open a **second terminal window**:

```bash
# 1. Navigate to frontend directory
cd hotel-booking-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example to .env (if .env doesn't already exist)
cp .env.example .env
```

### Frontend `.env` Configuration
Your `hotel-booking-frontend/.env` should contain:
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_STRIPE_PUB_KEY=pk_test_placeholder
```

### Run the Frontend App
```bash
npm run dev
```
* **Frontend Running at**: `http://localhost:5175`

Open [http://localhost:5175](http://localhost:5175) in your web browser.

---

## 🔑 Pre-Configured Demo Accounts

You can test all user roles immediately using the quick-fill demo buttons on the Sign In page or entering credentials manually:

| Role | Email | Password | Permissions & Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `test@user.com` | `12345678` | Manage all hotels, analytics dashboard, bookings & user oversight |
| **Hotel Owner** | `owner@hotel.com` | `12345678` | Add & edit hotels, room pricing, owner analytics, reservation logs |
| **Guest / Traveler** | `guest@user.com` | `12345678` | Browse stays, search destinations, book rooms, leave reviews, wishlist |

*(You can also click **"Create an account"** to register any new personal account).*

---

## 📦 Production Build

To test production builds locally before deployment:

### Backend Production Build
```bash
cd hotel-booking-backend
npm run build
npm start
```

### Frontend Production Build
```bash
cd hotel-booking-frontend
npm run build
npm run preview
```

---

## 🛠️ Common Troubleshooting

* **MongoDB Connection Refused (`ECONNREFUSED 127.0.0.1:27017`)**:
  Make sure your local MongoDB service is started (`net start MongoDB` on Windows) or use a free MongoDB Atlas connection string in `MONGODB_CONNECTION_STRING`.
* **Port Conflict (`EADDRINUSE: 5001` or `5175`)**:
  Ensure no previous instance is running in the background, or change `PORT` in `.env` and `VITE_API_BASE_URL` accordingly.
* **CORS Blocked**:
  Ensure `FRONTEND_URL` in `hotel-booking-backend/.env` matches the port your frontend is running on (`http://localhost:5175`).
