# Roadmap — Backend & Database (PHASE 1 → PHASE 4)

## PHASE 1 — Setup Backend (Express + Prisma + SQLite → Supabase)

### Tujuan
Membuat backend sederhana untuk:
- Menerima data sesi dari FE (POST /sessions)
- Mengambil semua sesi (GET /sessions)
- Menyimpan ke database (mulai SQLite, nanti migrasi ke Supabase)

### Struktur Folder (saran)
```
backend/
 ├─ src/
 │   ├─ index.js
 │   ├─ routes/
 │   │   └─ sessionRoutes.js
 │   ├─ controllers/
 │   │   └─ sessionController.js
 │   ├─ prisma/
 │   │   └─ schema.prisma
 ├─ package.json
 ├─ .env
 └─ README.md
```

### Langkah Setup (singkat)
1. Init project:
   - mkdir backend && cd backend
   - npm init -y
   - npm install express prisma @prisma/client cors dotenv
   - npx prisma init

2. Prisma schema (contoh)
```prisma
datasource db {
  provider = "sqlite" // ganti ke "postgresql" saat migrasi ke Supabase

}

generator client {
  provider = "prisma-client-js"
}

model Session {
  id           Int      @id @default(autoincrement())
  task         String
  focus        Int
  distracted   Int
  startedAt    DateTime
  endedAt      DateTime
  total        Int
  createdAt    DateTime @default(now())
}
```

3. .env (contoh)
```
DATABASE_URL="file:./dev.db"
```

4. Generate DB
```
npx prisma migrate dev --name init
```

5. Server (src/index.js)
```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sessionRoutes from "./routes/sessionRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/sessions", sessionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
```

6. Routes + Controller (ringkasan)

routes/sessionRoutes.js
```js
import express from "express";
import { getAllSessions, addSession } from "../controllers/sessionController.js";
const router = express.Router();

router.get("/", getAllSessions);
router.post("/", addSession);

export default router;
```

controllers/sessionController.js
```js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({ orderBy: { createdAt: "desc" } });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addSession = async (req, res) => {
  try {
    const data = req.body;
    const newSession = await prisma.session.create({ data });
    res.json(newSession);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

---

## PHASE 2 — Integrasi Frontend → Backend

Ubah `handleStop()` di frontend (focus.jsx) untuk POST session ke backend:

Contoh (ringkas):
```js
const handleStop = async () => {
  const endTime = Date.now();
  const newSession = {
    task: sessionData?.task || "Unnamed Task",
    focus: focusTime,
    distracted: distractedTime,
    startedAt: new Date(sessionData?.startTime || endTime - (focusTime + distractedTime) * 1000),
    endedAt: new Date(endTime),
    total: focusTime + distractedTime,
  };

  // Kirim ke backend
  await fetch("https://your-backend-url/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSession),
  });

  localStorage.removeItem("antyo_session");
  window.location.href = "/dashboard";
};
```

Update Dashboard untuk fetch sessions:
```js
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch("https://your-backend-url/sessions");
    const data = await res.json();
    setHistory(data);
  };
  fetchData();
}, []);
```

---

## PHASE 3 — Deploy Backend + DB

1. Railway (Express + SQLite)
   - Buat repo GitHub untuk backend
   - Deploy ke Railway (New Project → Deploy from GitHub)
   - Tambahkan Procfile:
     ```
     web: node src/index.js
     ```

2. Migrasi ke Supabase (PostgreSQL)
   - Buat project di https://supabase.com
   - Update .env dengan DATABASE_URL PostgreSQL
   - Jalankan:
     ```
     npx prisma migrate deploy
     ```

---

## PHASE 4 — MVP Complete & Next Steps (Status)

| Fitur / Tugas                      | Status |
|------------------------------------|--------|
| Focus Tracking (camera + timer)    | ✅     |
| Task Labeling & Mode               | ✅     |
| Local Storage                      | ✅     |
| Backend API (GET/POST)             | 🔄     |
| SQLite Local DB                    | 🔄     |
| Supabase Migration                 | 🔜     |
| Dashboard Insight                  | ✅     |
| Deploy Backend                     | 🔜     |
| Full MVP (multi-device)            | 🌟 Soon |

---

Catatan akhir:
- Mulai dari frontend-only (MVP) untuk iterasi cepat.
- Setelah validasi user & kebutuhan, lanjutkan dengan backend, DB cloud, auth, dan sync session.