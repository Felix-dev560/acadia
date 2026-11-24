# Acadia Frontend

React + Vite + Tailwind frontend for Acadia (Login / Register / Student Dashboard).

Connected to the Laravel backend using **Sanctum SPA authentication**.

---



Edit `.env`:

```
VITE_API_URL=http://127.0.0.1:8000
```

If the backend is running on another machine or Termux, use that IP (example: `http://192.168.1.5:8000`).

3. Install and run:

```bash
npm install
npm run dev
```

Open: http://localhost:5173

---

## Important – Backend CORS & Sanctum

In the Laravel backend `.env` make sure you have:

```
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
FRONTEND_URL=http://localhost:5173
```

Also in `config/cors.php` (or the CORS middleware) allow:

- origins: `http://localhost:5173`
- supports_credentials: `true`

Without the above, login/register will fail with CORS or 419 errors.

---

## Pages

| Route        | Description                          |
|--------------|--------------------------------------|
| `/auth`      | Combined Login + Register page       |
| `/dashboard` | Student dashboard + profile update   |

---

## API used

- `GET  /sanctum/csrf-cookie`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET  /api/v1/auth/me`
- `PUT  /api/v1/profile`
- `GET  /api/v1/countries`
- `GET  /api/v1/institutions`
- `GET  /api/v1/institutions/{id}/faculties`
- `GET  /api/v1/faculties/{id}/departments`
- `GET  /api/v1/academic-levels`
