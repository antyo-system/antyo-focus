Apa sih “Setup Backend” itu?

Backend = otak server.
Frontend = muka aplikasi (tampilan).
Database = memori jangka panjang.

Setup backend = bikin sistem yang:

menerima data dari frontend (misal durasi fokus)

menyimpannya ke database

mengirim data kembali ke frontend (misal dashboard)

menjalankan logika tambahan (validasi, keamanan)

Dalam ANTYO Focus:

FE kirim: “ini data fokus saya”

BE simpan ke DB

FE minta dashboard ke BE

⚡ 2) EXPRESS — Web server / REST API
👉 Apa itu Express?

Express adalah framework Node.js untuk bikin server HTTP.

Dia menjawab pertanyaan:

“Saat client kirim permintaan ke /sessions, server harus ngapain?”

Express bikin formatnya sederhana:

app.get("/sessions", (req, res) => {
  res.json({ message: "Hello" });
});

🧠 Fungsi Express di ANTYO Focus

Menyediakan API endpoint:

POST /sessions → simpan data sesi

GET /sessions → ambil data untuk dashboard

Ngatur middleware kayak:

CORS

JSON parser

Error handling

🔥 Analogi

Express = resepsionis di hotel.
Dia nerima tamu (request), lalu mengarahkannya ke orang yang tepat (controller).

🧬 3) PRISMA — ORM (Object Relational Mapper)
👉 Apa itu Prisma?

Prisma adalah alat yang menghubungkan JavaScript ke database.

Tanpa Prisma:

INSERT INTO sessions VALUES (task, focus, ...)


Dengan Prisma:

prisma.session.create({ data: newSession })


Lebih aman, lebih rapi, lebih cepat dikembangkan.

🧠 Fungsi Prisma di ANTYO Focus

Bikin struktur tabel lewat schema.prisma

Generate client untuk query

Mengelola migration (versi database)

Prisma bikin kamu bisa membuat “model” yang langsung berubah jadi tabel:

model Session {
  id        Int      @id @default(autoincrement())
  task      String
  focus     Int
  distracted Int
}

🧱 4) SQLITE — Database sederhana (file-based)
👉 SQLite itu apa?

SQLite = database yang tersimpan dalam 1 file .db.

Tanpa server.
Ringan banget.
Cocok buat MVP.

Kenapa SQLite dulu?

Cepat setup

Tidak perlu hosting

Cocok testing lokal

Di MVP ANTYO Focus:

Database lokal → dev.db
Prisma konek ke sqlite via:

DATABASE_URL="file:./dev.db"


Ketika kamu migrate → Prisma buat file itu.

🐘 5) SUPABASE — PostgreSQL di cloud + authentikasi + REST

Setelah MVP stabil → SQLite kurang karena:

Tidak bisa multi-device

Tidak bisa high concurrency

Tidak real-time

Tidak punya backup

Supabase = PostgreSQL + serverless functions + auth, elegant UI.

Supabase di ANTYO Focus:

Menyimpan sesi fokus secara online

Bisa diakses dari HP, laptop, banyak device

Bisa dibaca untuk dashboard publik atau private

Koneksi berubah dari:

sqlite → postgres


Dengan Prisma:
Cukup ganti .env

DATABASE_URL="postgresql://user:pass@host:5432/db"

🧠 6) CONTOH REAL: Data Flow ANTYO Focus
👁️ Step 1 — FE kirim data sesi
await fetch("/sessions", {
  method: "POST",
  body: JSON.stringify(newSession)
});

⚙️ Step 2 — Express terima request
router.post("/", addSession)

🧬 Step 3 — Prisma simpan ke database
await prisma.session.create({ data });

📦 Step 4 — SQLite/Supabase menyimpan permanen
sessions
 ├ id: 1
 ├ task: "Coding"
 ├ focus: 1200
 ├ distracted: 300
 └ startedAt: 2025-12-03

📊 Step 5 — Dashboard mengambil data
fetch("/sessions").then(res => res.json())

🧩 Ringkasannya dalam 1 kalimat tiap komponen:
Komponen	Peran singkat
Express	Menyediakan pintu masuk (API endpoint) untuk FE
Prisma	Penghubung elegant antara JS → Database
SQLite	Database lokal simple untuk MVP
Supabase	Database cloud PostgreSQL untuk production