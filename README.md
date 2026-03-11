# Pokemon App

Fullstack Pokemon app (React + NestJS): register, login, catch/release Pokemon, list with filters. Uses [PokeAPI](https://pokeapi.co/) and a custom backend for auth and caught Pokemon.

## Prerequisites

- **Docker** and **Docker Compose**
- **Node.js** (e.g. 20+) and **npm** (for running the frontend)

---

## How to run

Backend runs **only via Docker** (no local Node/MySQL setup). Frontend runs on your machine with npm.

### 1. Backend (API + MySQL)

From the **backend** folder:

```bash
cd backend
npm run docker:compose:up
```

- **API:** http://localhost:3000  
- **API docs (Swagger):** http://localhost:3000/api/docs  
- **MySQL:** `localhost:3306` (user: `demo`, password: `demo`, DB: `pokemons`)  
- **phpMyAdmin:** http://localhost:8080  

Stop: `Ctrl+C`, then `npm run docker:compose:down`. To remove the database volume: `docker compose down -v` (from the backend folder).

### 2. Frontend

In another terminal, from the **frontend** folder:

```bash
cd frontend
npm install
npm run dev
```

- **App:** http://localhost:5173  

If the API runs on another host/port, set in the frontend folder a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

---

## Quick reference

| Where         | Command                      | Result                       |
|---------------|------------------------------|------------------------------|
| **backend/**  | `npm run docker:compose:up`  | Backend + MySQL + phpMyAdmin |
| **frontend/** | `npm run dev`                | React app (localhost:5173)   |

**First run:** start the backend (`cd backend && npm run docker:compose:up`), then in a second terminal start the frontend (`cd frontend && npm install && npm run dev`) and open http://localhost:5173 in your browser.
