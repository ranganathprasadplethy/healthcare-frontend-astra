# Healthcare Frontend

React (Vite) web app. Needs the backend running (default http://localhost:5000).

## Run
1. `npm install`
2. `npm run dev`   (http://localhost:5173)

In dev, Vite proxies `/api` to `http://localhost:5000` (see `vite.config.js`; change the port there if needed).
If the backend is hosted elsewhere, copy `.env.example` to `.env` and set `VITE_API_URL`.
