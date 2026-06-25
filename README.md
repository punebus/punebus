# PuneBus

PuneBus is split into one shared backend, one public frontend, and three separate panel apps.

## Project Structure

- `Backend`: Node.js/Express API on port `5001`
- `Frontend`: public React/Vite website on port `5173`
- `Admin`: separate React/Vite admin app on port `5174`
- `Manager`: separate React/Vite manager app on port `5175`
- `Executor`: separate React/Vite executor app on port `5176`

## Panel Flow

- Admin logs in from `Admin`.
- Admin creates panel users from the admin dashboard.
- Manager users log in only from `Manager`.
- Executor users log in only from `Executor`.
- Public `Frontend` no longer contains login/admin/manager/executor panel routes.

## Backend APIs

- `POST /api/auth/admin/login`
- `POST /api/auth/manager/login`
- `POST /api/auth/executor/login`
- `GET /api/auth/me`
- `GET /api/panels/overview`
- `POST /api/admin/user`
- `GET /api/admin/list/:role`

## Run Locally

Install dependencies once in each folder:

```bash
cd Backend && npm install
cd ../Frontend && npm install
cd ../Admin && npm install
cd ../Manager && npm install
cd ../Executor && npm install
```

Start each app in a separate terminal:

```bash
cd Backend && npm start
cd Frontend && npm run dev
cd Admin && npm run dev
cd Manager && npm run dev
cd Executor && npm run dev
```

Local URLs:

- Public: `http://127.0.0.1:5173`
- Admin: `http://127.0.0.1:5174`
- Manager: `http://127.0.0.1:5175`
- Executor: `http://127.0.0.1:5176`
