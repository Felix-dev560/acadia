# Acadia API Contract - Phase 1

**Base URL:** `http://<YOUR_TERMUX_IP>:8000/api/v1` (Frontend must configure this).
**Auth Method:** Laravel Sanctum (SPA Cookie-Based Authentication).

## Authentication Flow
1. Frontend must call `GET /sanctum/csrf-cookie` before logging in.
2. Frontend must use `withCredentials: true` in all Axios/Fetch requests.
3. Backend returns a secure session cookie. Do not store tokens in LocalStorage.

## Standard JSON Responses
**Success:**
```json
{ "success": true, "message": "...", "data": { ... } }
