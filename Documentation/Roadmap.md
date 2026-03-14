# ANTYO Focus — Development Roadmap

> Rencana pengembangan bertahap dari MVP menuju produk lengkap.  
> Setiap fase punya deliverable jelas yang bisa di-deploy.

---

## Fase 0: Foundation ✅ (Selesai — Nov 2025)

| # | Task | Status |
|---|------|--------|
| 0.1 | Setup React + Vite + TailwindCSS | ✅ |
| 0.2 | Implementasi Mediapipe Face Detection | ✅ |
| 0.3 | Buat PreFocus → Focus → Dashboard flow | ✅ |
| 0.4 | Timer & stopwatch mode | ✅ |
| 0.5 | LocalStorage persistence | ✅ |
| 0.6 | Deploy ke Vercel | ✅ |

**Deliverable:** App bisa tracking fokus via webcam, data tersimpan di localStorage.

---

## Fase 1: Supabase Integration ✅ (Selesai — Mar 2026)

| # | Task | Status |
|---|------|--------|
| 1.1 | Setup Supabase project + tabel focus_sessions | ✅ |
| 1.2 | Migration SQL dengan constraints & indexes | ✅ |
| 1.3 | Frontend Supabase client (`src/lib/supabase.js`) | ✅ |
| 1.4 | Insert sesi langsung ke Supabase dari focus.jsx | ✅ |
| 1.5 | Dashboard fetch dari Supabase | ✅ |
| 1.6 | RLS policy untuk anon access | ✅ |
| 1.7 | Fix white screen (env guard) | ✅ |
| 1.8 | Fix insert error visibility + await | ✅ |
| 1.9 | Dashboard rewrite — formatTime, focus score, today stats | ✅ |
| 1.10 | README, Error Log, Roadmap documentation | ✅ |

**Deliverable:** Data sesi persisten di cloud, dashboard informatif dengan score & stats.

---

## Fase 2: UX Polish & Session Flow (Next)

| # | Task | Status | Priority |
|---|------|--------|----------|
| 2.1 | Session Summary screen setelah STOP (sebelum redirect) | 🔲 | High |
| 2.2 | "Focus Again" button — mulai sesi baru dengan task sama | 🔲 | High |
| 2.3 | "Take a Break" — break timer (5 min default) | 🔲 | High |
| 2.4 | Improve Focus screen UI — timer besar, status visual, animasi | 🔲 | High |
| 2.5 | Improve PreFocus UI — lebih clean & modern | 🔲 | Medium |
| 2.6 | Responsive design — mobile friendly | 🔲 | Medium |
| 2.7 | Dark/light mode toggle | 🔲 | Low |
| 2.8 | Sound notification saat timer habis (timer mode) | 🔲 | Medium |
| 2.9 | Timer countdown display untuk timer mode | 🔲 | High |

**Deliverable:** Flow yang lengkap (focus → summary → break/again), UI professional.

---

## Fase 3: Gamification & XP System

| # | Task | Status | Priority |
|---|------|--------|----------|
| 3.1 | XP calculation logic (focus_time × multiplier) | 🔲 | High |
| 3.2 | Level system (XP thresholds) | 🔲 | High |
| 3.3 | XP display di session summary & dashboard | 🔲 | High |
| 3.4 | Streak tracking (berapa hari berturut-turut fokus) | 🔲 | Medium |
| 3.5 | Achievement badges (first session, 1h focus, dll) | 🔲 | Medium |
| 3.6 | Progress bar / level-up animation | 🔲 | Low |
| 3.7 | Leaderboard (future — perlu auth) | 🔲 | Low |

**Deliverable:** Fokus jadi seru — XP, level, streak, achievements.

---

## Fase 4: Authentication & User Management

| # | Task | Status | Priority |
|---|------|--------|----------|
| 4.1 | Supabase Auth setup (email/password) | 🔲 | High |
| 4.2 | Login / Register page | 🔲 | High |
| 4.3 | Protected routes (redirect kalau belum login) | 🔲 | High |
| 4.4 | User-specific data (RLS by user_id) | 🔲 | High |
| 4.5 | Profile page | 🔲 | Medium |
| 4.6 | Google OAuth login | 🔲 | Low |
| 4.7 | Forgot password flow | 🔲 | Low |

**Deliverable:** Multi-user support, data terisolasi per user.

---

## Fase 5: Analytics & Insights

| # | Task | Status | Priority |
|---|------|--------|----------|
| 5.1 | Weekly focus chart (bar/line chart) | 🔲 | High |
| 5.2 | Daily heatmap (jam berapa paling fokus) | 🔲 | Medium |
| 5.3 | Task-based analytics (task mana paling sering) | 🔲 | Medium |
| 5.4 | Focus trend (membaik/memburuk) | 🔲 | Medium |
| 5.5 | Export data (CSV/PDF) | 🔲 | Low |

**Deliverable:** User bisa lihat pola fokus mereka dan improve.

---

## Fase 6: Advanced AI Features

| # | Task | Status | Priority |
|---|------|--------|----------|
| 6.1 | Distraction type detection (phone, looking away, sleepy) | 🔲 | High |
| 6.2 | Focus quality scoring (bukan hanya hadir/tidak) | 🔲 | Medium |
| 6.3 | Smart break suggestion berdasarkan fatigue detection | 🔲 | Medium |
| 6.4 | Posture detection (duduk tegak vs bungkuk) | 🔲 | Low |
| 6.5 | Eye tracking (gaze direction) | 🔲 | Low |

**Deliverable:** AI yang lebih pintar — bukan hanya "wajah ada/tidak" tapi kualitas fokus.

---

## Fase 7: Platform & Scale

| # | Task | Status | Priority |
|---|------|--------|----------|
| 7.1 | PWA (Progressive Web App) — install di mobile | 🔲 | High |
| 7.2 | Notification system (reminder untuk fokus) | 🔲 | Medium |
| 7.3 | API rate limiting & security hardening | 🔲 | Medium |
| 7.4 | Backend API (Node.js/Express) untuk logic kompleks | 🔲 | Medium |
| 7.5 | Multiplayer focus rooms (focus together) | 🔲 | Low |
| 7.6 | Browser extension (track focus di tab lain) | 🔲 | Low |
| 7.7 | Mobile app (React Native) | 🔲 | Low |

**Deliverable:** ANTYO Focus jadi platform lengkap, bukan hanya web app.

---

## Summary

| Fase | Nama | Status | Target |
|------|------|--------|--------|
| 0 | Foundation | ✅ Done | Nov 2025 |
| 1 | Supabase Integration | ✅ Done | Mar 2026 |
| 2 | UX Polish & Session Flow | 🔲 Next | — |
| 3 | Gamification & XP | 🔲 Planned | — |
| 4 | Auth & User Management | 🔲 Planned | — |
| 5 | Analytics & Insights | 🔲 Planned | — |
| 6 | Advanced AI Features | 🔲 Planned | — |
| 7 | Platform & Scale | 🔲 Planned | — |

> **Prinsip:** Satu fase selesai dulu, deploy, validasi, lalu lanjut ke fase berikutnya. Jangan loncat.
