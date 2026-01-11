<!-- ...existing code... -->

### TAHAP 4 — ARCHITECTURE

---

## ✅ 1. Pilih Tech Stack (Final)

Ini versi yang PALING cocok untuk kamu (skill, resource, tujuan MVP).

### 🖥️ Frontend
- React + Vite  
- TailwindCSS v4  
- (Opsional) Zustand / Jotai untuk state management

Alasan:
- Cepat build, ringan
- Integrasi webcam & Mediapipe mudah
- Cocok untuk animasi & UI modern

### 🧠 Backend
- Untuk MVP ANTYO Focus v1.0 → Backend tidak wajib
  - Sesi dapat disimpan di localStorage
  - Fokus dulu ke UI & UX (iterasi cepat)
  - Face detection logic di frontend
### 🧠 Backend
- Untuk full ANTYO System (skala selanjutnya), opsi:
  - Node.js (Express / NestJS) — paling cocok untuk jangka panjang
  - FastAPI (Python) — jika mau integrasi AI/ML

Rekomendasi: Mulai tanpa backend dulu, tambah Node.js / FastAPI setelah MVP siap.

### 🗄️ Database
- Rekomendasi: Supabase (PostgreSQL)
  - Login simple, REST & realtime, cepat deploy, gratis di awal


### 🚀 Deploy
- Frontend: Vercel (cepat & gratis)
- Backend: Railway / Render
- DB: Supabase

---

## 📁 2. Struktur Proyek (Pasti Dipakai)

Versi 1 — MVP (paling cepat):
```
/antyo-focus
  /src
  /public
  package.json
  vite.config.js
  README.md
```
Semua logic frontend di sini dulu.

Versi 2 — Production Ready (setelah siap backend):
```
/antyo-focus-app     ← Frontend (React)
 /antyo-focus-api    ← Backend (Node/FastAPI)
 /database           ← migration / schema
 /README.md
```
Atau struktur monorepo:
```
/frontend
/backend
/database
/docs
```

Mana yang kita pakai sekarang?
- Kita sedang membangun:
  - PreFocus page
  - Focus page (webcam + detection)
  - Dashboard
- Jadi: pakai Struktur Versi 1 dulu (frontend-only).

---

## 🔥 FINAL DECISION (Azul-approved)

Arsitektur resmi ANTYO Focus v1:
- Tech Stack:
  - React (Vite)
  - TailwindCSS v4
  - Mediapipe / Human.js (face detection)
  - LocalStorage (session data)
  - No backend for MVP
- Deployment:
  - Vercel (frontend)
- Project Structure:
  - /src
  - /public
  - vite.config.js
  - package.json
  - README.md

Setelah MVP berjalan dan user base ada → tambah:
- Node.js backend + API
- Supabase DB
- Auth & session sync

<!-- ...existing code... -->