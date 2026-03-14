### TAHAP 1 — IDEATION (IDE → PRODUK)

1. Define Problem

**Azul**
- Masalah apa yang mau diselesaikan?
- Siapa yang punya masalah ini?
- Frekuensi & intensitas masalah?

**Azel**
- Kalau kamu bikin karena “aku sendiri butuh”, itu VALID banget. ANTYO System lahir dari kebutuhanmu sendiri.

2. Define User Persona

Minimal jawab:
- Umur?
- Gender?
- Kebutuhan?
- Perilaku online?
- Pain point terbesar?

Ini penting biar desain & fitur sesuai.

3. Tentukan Core Value (1 kalimat)

Contoh:
- ANTYO Focus: “Bikin fokus jadi seru & gamified.”
- Bravas Bites: “Makanan enak, cepat, murah namun aesthetic.”
- ANTYO Finance: “Kelola uangmu se-simple main game.”

---

### 🧱 TAHAP 2 — REQUIREMENTS

4. Tentukan Fitur (Rinci tapi sedikit dulu)
- UTAMAKAN: MVP = 1 masalah + 1 fitur utama
- Contoh ANTYO Focus:
  - Fokus timer
  - Hitung XP
  - Dashboard simple
- Jangan langsung bikin 10 fitur.

5. Tentukan Flow (User Journey)
- Contoh:
  1. User buka web
  2. Login
  3. Start fokus
  4. Dapat XP
  5. Lihat progress

Flow = arah kerja backend & frontend.

---

### 🎨 TAHAP 3 — DESAIN

6. Wireframe (core layar saja)
- Minimal 3 page:
  - Landing
  - Dashboard
  - Page utama (contoh: focus timer)
- Tools yang disarankan:
  - Figma
  - Whimsical
  - Notion sketch pun cukup

7. UI Design (opsional di awal)
- Bikin versi clean: warna, komponen, typography
- Kalau buru-buru → skip dulu, langsung FE.

---

### 🧩 TAHAP 4 — ARCHITECTURE

8. Pilih Tech Stack
- Untuk kamu (yang udah biasa):
  - Frontend: React + Tailwind
  - Backend: Node.js / FastAPI
  - DB: PostgreSQL / Supabase
  - Deploy: Vercel + Render / Railway

9. Tentukan Struktur Proyek
- Contoh:
  - /frontend
  - /backend
  - /database
  - /README.md

---

### 🏗️ TAHAP 5 — DEVELOPMENT

10. FE dulu atau BE dulu?
- Urutan paling ideal:

🔥 Step A — Backend (API) dulu
- bikin endpoint user
- endpoint fitur utama
- test pakai Postman
- siap digunakan FE

🔥 Step B — Frontend
- layout basic
- connect API
- buat state + logic

11. QA / Testing
- Minimal:
  - Coba semua tombol
  - Coba login salah
  - Coba fitur error
  - Perbaiki bug

---

### 🚀 TAHAP 6 — DEPLOY

12. FE Deploy
- Vercel → cepat
- Domain custom (opsional)

13. BE Deploy
- Railway
- Render
- Supabase (untuk DB)

---

### 📈 TAHAP 7 — ITERASI

14. Kumpulkan feedback
- tanya user
- tanya teman
- tanya komunitas

15. Perbaiki + Tambah fitur baru