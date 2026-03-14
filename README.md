# ANTYO Focus

> AI-powered focus tracking app — deteksi fokus/distraksi secara real-time via webcam menggunakan Mediapipe Face Landmarker, dengan penyimpanan sesi ke Supabase.

**Live Demo:** [antyo-focus.vercel.app](https://antyo-focus.vercel.app)

---

## Fitur Utama

- **Face Detection Focus Tracking** — Webcam + Mediapipe FaceLandmarker mendeteksi apakah user fokus (wajah terlihat) atau distracted (wajah tidak terlihat)
- **Timer & Stopwatch Mode** — Pilih mode sesi sebelum mulai
- **Real-time Counter** — Focus time & distracted time dihitung secara terpisah dalam detik
- **Session Summary Dashboard** — Lihat semua sesi dari Supabase dengan focus score (%), waktu akurat, dan statistik harian
- **Supabase Integration** — Data sesi disimpan ke PostgreSQL via Supabase (bukan localStorage)

---

## Tech Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Frontend | React 19 + Vite + TailwindCSS v4  |
| AI/ML    | Mediapipe Tasks Vision (FaceLandmarker) |
| Database | Supabase (PostgreSQL)              |
| Deploy   | Vercel (Frontend)                  |

---

## Struktur Project

```
antyo-focus/
├── src/
│   ├── App.jsx              # Router utama
│   ├── main.jsx             # Entry point
│   ├── lib/
│   │   └── supabase.js      # Supabase client
│   ├── pages/
│   │   ├── prefocus.jsx     # Setup sesi (task, mode, duration)
│   │   ├── focus.jsx        # Focus screen + face detection
│   │   └── Dashboard.jsx    # Session summary & stats
│   └── styles/
│       └── focus.css
├── backend/
│   └── supabase/
│       └── migrations/
│           └── 001_create_focus_sessions.sql
├── Documentation/
│   ├── ARCHITECTURE.md
│   ├── Requirements.md
│   ├── Roadmap.md
│   ├── ERROR_LOG.md         # Daftar error & solusi
│   └── ...
├── .env                     # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── vercel.json
└── package.json
```

---

## User Flow

```
PreFocus (/) → Focus (/focus) → Stop → Dashboard (/dashboard)
```

1. **PreFocus** — User isi task label, pilih timer/stopwatch, set durasi
2. **Focus** — Webcam aktif, face detection jalan, timer berjalan
3. **Stop** — Data dikirim ke Supabase, redirect ke Dashboard
4. **Dashboard** — Tampilkan semua sesi, statistik hari ini & all-time, focus score

---

## Setup Lokal

```bash
# 1. Clone repo
git clone https://github.com/antyo-system/antyo-focus.git
cd antyo-focus

# 2. Install dependencies
npm install

# 3. Setup environment variables
# Buat file .env di root:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# 4. Jalankan Supabase migration
# Copy isi backend/supabase/migrations/001_create_focus_sessions.sql
# Paste & run di Supabase Dashboard → SQL Editor

# 5. Run dev server
npm run dev
```

---

## Environment Variables

| Variable               | Deskripsi                    | Wajib |
|------------------------|------------------------------|-------|
| `VITE_SUPABASE_URL`   | Supabase project URL         | Ya    |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key  | Ya    |

> **Penting:** Set variabel ini juga di Vercel Dashboard → Settings → Environment Variables untuk production.

---

## Database Schema

Tabel `focus_sessions`:

| Column          | Type        | Deskripsi                     |
|-----------------|-------------|-------------------------------|
| id              | SERIAL PK   | Auto-increment ID             |
| task            | TEXT        | Nama task                     |
| mode            | TEXT        | 'timer' atau 'stopwatch'      |
| focus_time      | INTEGER     | Waktu fokus dalam detik       |
| distracted_time | INTEGER     | Waktu distracted dalam detik  |
| total_time      | INTEGER     | Total waktu sesi dalam detik  |
| started_at      | TIMESTAMPTZ | Waktu mulai sesi              |
| ended_at        | TIMESTAMPTZ | Waktu selesai sesi            |
| created_at      | TIMESTAMPTZ | Auto-generated                |
| updated_at      | TIMESTAMPTZ | Auto-updated via trigger      |

---

## Status Proyek

**Versi saat ini: v0.3.0** — Supabase Integration + Dashboard Improvement

Lihat [CHANGELOG.md](CHANGELOG.md) untuk riwayat perubahan lengkap.  
Lihat [Documentation/Roadmap.md](Documentation/Roadmap.md) untuk rencana pengembangan.  
Lihat [Documentation/ERROR_LOG.md](Documentation/ERROR_LOG.md) untuk catatan error & debugging.
