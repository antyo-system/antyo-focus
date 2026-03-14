# ANTYO Focus — Database Architecture (Supabase / PostgreSQL)

## Overview

ANTYO Focus menggunakan **Supabase** (PostgreSQL) sebagai database utama dengan **Supabase JS Client** (`@supabase/supabase-js`) — tanpa ORM.

```
┌──────────────┐     HTTP     ┌──────────────┐  Supabase JS  ┌──────────────────┐
│   Frontend   │ ──────────── │   Express    │ ──────────── │    Supabase      │
│   (React)    │   REST API   │   Backend    │   Client      │   PostgreSQL     │
└──────────────┘              └──────────────┘              └──────────────────┘
```

---

## Stack

| Layer    | Technology            | Purpose                    |
| -------- | --------------------- | -------------------------- |
| Database | Supabase PostgreSQL   | Cloud-hosted relational DB |
| Client   | @supabase/supabase-js | Database client SDK        |
| Backend  | Express.js            | REST API server            |
| Frontend | React (Vite)          | SPA client                 |

---

## Table: `focus_sessions`

Menyimpan setiap sesi fokus yang dilakukan user, termasuk durasi fokus, durasi distraksi, dan metadata waktu.

### Schema

| Column            | Type          | Nullable | Default        | Description                             |
| ----------------- | ------------- | -------- | -------------- | --------------------------------------- |
| `id`              | `SERIAL`      | NOT NULL | auto-increment | Primary key                             |
| `task`            | `TEXT`        | NOT NULL | —              | Label task yang dikerjakan              |
| `mode`            | `TEXT`        | NOT NULL | `'stopwatch'`  | Mode sesi: `'timer'` atau `'stopwatch'` |
| `focus_time`      | `INTEGER`     | NOT NULL | —              | Durasi fokus dalam **detik**            |
| `distracted_time` | `INTEGER`     | NOT NULL | —              | Durasi distraksi dalam **detik**        |
| `total_time`      | `INTEGER`     | NOT NULL | —              | Total durasi sesi dalam **detik**       |
| `started_at`      | `TIMESTAMPTZ` | NOT NULL | —              | Waktu mulai sesi                        |
| `ended_at`        | `TIMESTAMPTZ` | NOT NULL | —              | Waktu selesai sesi                      |
| `created_at`      | `TIMESTAMPTZ` | NOT NULL | `NOW()`        | Waktu record dibuat                     |
| `updated_at`      | `TIMESTAMPTZ` | NOT NULL | `NOW()`        | Waktu terakhir diupdate (auto-trigger)  |

### Column Naming (JS → DB)

| JS (API body)    | DB Column         |
| ---------------- | ----------------- |
| `focusTime`      | `focus_time`      |
| `distractedTime` | `distracted_time` |
| `totalTime`      | `total_time`      |
| `startedAt`      | `started_at`      |
| `endedAt`        | `ended_at`        |
| `createdAt`      | `created_at`      |
| `updatedAt`      | `updated_at`      |

### Constraints

| Constraint                     | Rule                                            |
| ------------------------------ | ----------------------------------------------- |
| `chk_mode`                     | `mode` hanya boleh `'timer'` atau `'stopwatch'` |
| `chk_focus_time_positive`      | `focus_time >= 0`                               |
| `chk_distracted_time_positive` | `distracted_time >= 0`                          |
| `chk_total_time_positive`      | `total_time >= 0`                               |
| `chk_task_not_empty`           | `task` tidak boleh string kosong                |
| `chk_ended_after_started`      | `ended_at >= started_at`                        |

### Indexes

| Index Name                      | Column       | Purpose                              |
| ------------------------------- | ------------ | ------------------------------------ |
| `idx_focus_sessions_created_at` | `created_at` | Query filter sesi per hari/rentang   |
| `idx_focus_sessions_started_at` | `started_at` | Query dashboard, calendar, heatmap   |
| `idx_focus_sessions_task`       | `task`       | Query "task paling sering dilakukan" |

### Trigger

| Trigger                         | Action                                                |
| ------------------------------- | ----------------------------------------------------- |
| `trg_focus_sessions_updated_at` | Auto-update `updated_at` ke `NOW()` saat row diupdate |

### Row Level Security (RLS)

RLS sudah di-enable. Saat ini policy mengizinkan semua akses karena belum ada authentication. Setelah integrasi Supabase Auth, ganti policy menjadi:

```sql
-- Contoh: hanya user pemilik sesi yang bisa akses
CREATE POLICY "Users can manage own sessions" ON focus_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## API Endpoints

### `POST /api/sessions`

Menyimpan sesi fokus baru ke database.

**Request Body:**

```json
{
  "task": "Coding React",
  "mode": "timer",
  "focusTime": 1500,
  "distractedTime": 300,
  "totalTime": 1800,
  "startedAt": "2026-03-15T09:00:00.000Z",
  "endedAt": "2026-03-15T09:30:00.000Z"
}
```

**Response:** `201 Created`

```json
{
  "id": 1,
  "task": "Coding React",
  "mode": "timer",
  "focus_time": 1500,
  "distracted_time": 300,
  "total_time": 1800,
  "started_at": "2026-03-15T09:00:00.000Z",
  "ended_at": "2026-03-15T09:30:00.000Z",
  "created_at": "2026-03-15T09:30:01.000Z",
  "updated_at": "2026-03-15T09:30:01.000Z"
}
```

**Validasi:**

- `task` wajib diisi (tidak boleh kosong)
- `focusTime`, `distractedTime`, `totalTime` wajib ada
- `startedAt`, `endedAt` wajib ada

---

### `GET /api/sessions/today`

Ambil semua sesi hari ini (berdasarkan `startedAt >= 00:00 hari ini`).

**Response:** `200 OK` — Array of sessions, ordered by `startedAt` descending.

---

### `GET /api/sessions`

Ambil semua sesi, dengan optional date range filter.

**Query Parameters:**
| Param | Type | Description |
|--------|--------|----------------------------------|
| `from` | string | ISO date — filter `startedAt >=` |
| `to` | string | ISO date — filter `startedAt <=` |

**Contoh:** `GET /api/sessions?from=2026-03-10&to=2026-03-15`

---

### `GET /api/sessions/summary`

Ringkasan statistik untuk dashboard.

**Response:**

```json
{
  "today": {
    "totalFocus": 3600,
    "totalDistracted": 900,
    "totalTime": 4500,
    "sessionCount": 3
  },
  "week": {
    "totalFocus": 25200,
    "totalDistracted": 5400,
    "totalTime": 30600,
    "sessionCount": 15
  }
}
```

---

### `GET /api/health`

Health check endpoint.

**Response:** `200 OK`

```json
{ "status": "ok", "message": "ANTYO Focus backend running 🧠" }
```

---

## Data Flow

### Sesi Fokus (Write)

```
PreFocus Page
  │  user input: task, mode, duration
  │  simpan ke localStorage
  ▼
Focus Page
  │  kamera ON → MediaPipe face detection
  │  hitung focusTime & distractedTime per detik
  │  user klik STOP
  ▼
handleStop()
  │  POST /api/sessions
  │  body: { task, mode, focusTime, distractedTime, totalTime, startedAt, endedAt }
  ▼
Express Backend
  │  validasi input
  │  supabase.from('focus_sessions').insert()
  ▼
Supabase PostgreSQL
  │  INSERT INTO focus_sessions
  │  auto: created_at = NOW()
  ▼
Response 201 → redirect ke Dashboard
```

### Dashboard (Read)

```
Dashboard Page
  │  GET /api/sessions/today     → sesi hari ini
  │  GET /api/sessions/summary   → ringkasan statistik
  ▼
Express Backend
  │  supabase.from('focus_sessions').select() / aggregate
  ▼
Supabase PostgreSQL
  │  SELECT ... WHERE started_at >= today
  ▼
Response JSON → render di React
```

---

## Setup & Migration Guide

### 1. Buat project Supabase

1. Buka [supabase.com](https://supabase.com) → Create new project
2. Catat **Project URL** dan **anon key**
3. Buka **Settings > Database > Connection string > URI**
4. Copy connection string

### 2. Konfigurasi environment

Edit `backend/.env`:

```env
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="eyJ..."
```

### 3. Jalankan migration

**Opsi A — Via Supabase Dashboard (disarankan):**

1. Buka Supabase Dashboard > SQL Editor
2. Paste isi file `backend/supabase/migrations/001_create_focus_sessions.sql`
3. Run

**Opsi B — Via Supabase CLI:**

```bash
cd backend
npx supabase init          # jika belum
npx supabase db push       # push migration ke Supabase
```

### 4. Install dependencies

```bash
cd backend
npm install @supabase/supabase-js
```

### 5. Jalankan server

```bash
npm run dev
```

---

## Future Considerations

| Feature             | Database Change Needed                                      |
| ------------------- | ----------------------------------------------------------- |
| **User Auth**       | + `User` table, + `user_id` FK di `focus_sessions`, + RLS   |
| **To-Do List**      | + `Todo` table, optional FK ke `focus_sessions`             |
| **Calendar**        | Query existing `started_at` / `ended_at` — no schema change |
| **Streak/Heatmap**  | Query existing `started_at` grouped by date — no change     |
| **Timeblocking**    | + `TimeBlock` table, FK ke `focus_sessions`                 |
| **Tags/Categories** | + `Tag` table, + junction table `session_tags`              |
