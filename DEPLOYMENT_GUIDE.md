## Multi-cloud Free-tier Deployment Guide

This project is structured as a monorepo with three deployable parts:

- Frontend (Vite + React) in `client/` → Vercel (Free)
- Backend API (Node/Express + MongoDB) in `server/` → Railway (Free)
- ML Service (Flask) in `ml-service/` → Render (Free)
- Database → MongoDB Atlas (Free)

Follow these steps to deploy each piece and connect them together.

---

### 1) MongoDB Atlas (Database)

1. Create an account at https://www.mongodb.com/cloud/atlas and provision a free-tier cluster.
2. Create a database user and allow access from your IPs (or 0.0.0.0/0 temporarily).
3. Get the connection string (SRV URI). Example:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/aarogya-sahayak?retryWrites=true&w=majority`
4. You will use this URI as `MONGO_URI` in the backend environment.

**Security note:** Never commit your database credentials to the repo. Store them only in your hosting provider's Environment Variables.

Required Backend env vars:

- `MONGO_URI` → Atlas URI
- `JWT_SECRET` → long random secret
- `CLIENT_URL` → your Vercel URL, e.g. `https://<your-vercel-app>.vercel.app`
- `ML_SERVICE_URL` → Render ML URL + endpoint, e.g. `https://<your-render-ml>.onrender.com/api/ml/predict`

---

### 2) ML Service on Render (Python/Flask)

We included a `render.yaml` at repo root which defines a Web Service for ML:

- Root dir: `ml-service`
- Build installs Python deps and copies `disease_predictor_v2.pkl` and `processed_data_info.pkl` from repo root.
- Start uses `gunicorn` and exposes health check at `/health`.

Steps:

1. Push this repository to GitHub (already done).
2. Log in to Render → New → Blueprint → Connect this repo → pick `render.yaml`.
3. Create the service. Render sets `PORT` automatically; no extra config required.
4. After deploy, note the public URL, e.g. `https://aarogya-ml-service.onrender.com`.
5. Compose the prediction endpoint as: `https://<render-url>/api/ml/predict`.

Optional environment variables on Render:

- `FLASK_ENV=production`
- `AAROGYA_ML_MODELS_DIR=.` (already set via blueprint)

---

### 3) Backend API on Railway (Node/Express)

We added a `server/Dockerfile`. Railway can deploy either via Nixpacks (auto) or this Dockerfile.

Steps:

1. Log in to Railway → New Project → Deploy from GitHub → select this repo.
2. When asked for service root, choose `server/` directory (monorepo).
3. Choose Dockerfile or default Node builder. If using Dockerfile, no command changes needed.
4. Set Environment Variables in the Railway service:
   - `PORT=5000` (Railway will map externally)
   - `MONGO_URI=<your Atlas URI>`
   - `JWT_SECRET=<your long random secret>`
   - `CLIENT_URL=https://<your-vercel-app>.vercel.app`
   - `ML_SERVICE_URL=https://<your-render-ml>.onrender.com/api/ml/predict`
5. Deploy and wait for the public URL, e.g. `https://<your-railway-backend>.up.railway.app`.
6. Verify health: `GET https://<railway>/api/health` → `{ status: 'ok', mongodb: 'connected' }`.

---

### 4) Frontend on Vercel (Vite + React)

We added `client/vercel.json` with build/output settings and a rewrite for API calls.

Steps:

1. Log in to Vercel → New Project → import from GitHub → select this repo.
2. Set Project Root to `client/` and Framework preset should auto-detect Vite.
3. In Project Settings → Environment Variables (optional for analytics/maps):
   - e.g. `VITE_MAPBOX_TOKEN` if you use maps.
4. Update the API rewrite in `client/vercel.json` to your Railway backend URL:
   - Replace `https://YOUR-RAILWAY-BACKEND-URL` with the actual Railway URL.
5. Deploy. Vercel URL will be like `https://<your-vercel-app>.vercel.app`.

Because the frontend uses relative `/api` requests, the Vercel rewrite will proxy calls to the backend.

---

### 5) Final checks

- Open the frontend Vercel URL and log in/register to test flows.
- Check ML predictions on the Analysis page; ensure the backend reaches `ML_SERVICE_URL`.
- Realtime features (Socket.IO) should work with CORS based on `CLIENT_URL`.

---

### Troubleshooting

- CORS errors → Ensure `CLIENT_URL` on the backend matches the exact Vercel URL.
- 500 from prediction → Verify Render ML URL is correct and model files were copied (see Render logs).
- MongoDB not connected → Check `MONGO_URI` credentials/IP allowlist.
- 404 for API on Vercel → Verify `client/vercel.json` rewrite points to your Railway URL.

---

### Environment variable templates

`server` (Railway):

```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
CLIENT_URL=https://your-vercel-app.vercel.app
ML_SERVICE_URL=https://your-render-ml.onrender.com/api/ml/predict
```

`ml-service` (Render):

```
FLASK_ENV=production
AAROGYA_ML_MODELS_DIR=.
```

`client` (Vercel):

```
# optional
VITE_MAPBOX_TOKEN=...
```
