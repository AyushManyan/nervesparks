# NerveSparks: Recipe & Nutrition RAG System

## Overview
A Retrieval-Augmented Generation (RAG) system for personalized meal recommendations. It processes recipes, nutritional data, and dietary guidelines to suggest meals tailored to user health conditions, preferences, and goals.

## Features
- **Recipe database & nutritional analysis**
- **Dietary restriction & allergy consideration**
- **Health condition-based meal recommendations**
- **Nutritional goal optimization & tracking**
- **Ingredient substitution suggestions**
- **Context-aware retrieval using embeddings**

## Architecture
- **Backend**: Node.js/Express
  - Recipe, user, intake, recommendation, health controllers
  - Embedding & retrieval services
  - Ingredient substitution logic
- **Frontend**: React + Vite
  - User authentication & profile
  - Recipe browsing & detail view
  - Intake logging & progress tracking
  - Health check & recommendations

## Setup Instructions
### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local or cloud)

### Backend
```bash
cd backend
npm install
# Configure environment variables in .env (see below)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run start
```

### Environment Variables
Create a `.env` file in `backend/` with:
```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key (optional for LLM-based recommendations)
```

## Usage Guide
- Register/login as a user
- Set dietary preferences, allergies, and health conditions in your profile
- Browse recipes, view nutrition, and log intake
- Get personalized recommendations and health checks
- Track daily nutritional progress

## API Endpoints (Backend)
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/recipes/` — List recipes
- `GET /api/recipes/:id` — Get recipe details
- `POST /api/intake` — Log intake
- `GET /api/intake/progress` — Get daily progress
- `GET /api/recommend` — Get recommendations
- `POST /api/health/check` — Health condition check
- `GET /api/recipes/substitute/:ingredient` — Ingredient substitution

## Deployment
- Deploy backend (e.g., Render, Heroku, Vercel)
- Deploy frontend (e.g., Vercel, Netlify)
- [Demo Link](#) <!-- Add your public demo link here -->


## Contribution
Pull requests and issues are welcome! Please follow conventional commit messages and add tests for new features.

## License
MIT

---
For more details, see the code in `backend/` and `frontend/` folders. For questions, contact the repository owner.
