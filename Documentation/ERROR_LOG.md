# ANTYO Focus — Error Log & Debugging History

> Catatan semua error yang ditemukan selama pengembangan, penyebab, dan solusinya.  
> Berguna sebagai referensi agar error yang sama tidak terulang.

---

## Error #1: Layar Putih (White Screen) di Vercel Production

**Tanggal:** 15 Maret 2026  
**Severity:** Critical  
**Halaman:** Semua halaman (/, /focus, /dashboard)

### Gejala
- App berjalan normal di localhost (`npm run dev`)
- Setelah deploy ke Vercel → semua halaman putih total, tidak ada error terlihat

### Penyebab
`supabase.js` memanggil `createClient(undefined, undefined)` karena environment variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` **belum diset di Vercel**.

```js
// Kode sebelum fix — langsung crash kalau env undefined
export const supabase = createClient(supabaseUrl, supabaseKey);
```

Supabase `createClient()` throw error jika diberi `undefined`, dan karena ini terjadi di level module (bukan di dalam component), seluruh React app gagal render.

### Solusi
1. **Guard supabase client** — return `null` kalau env belum ada:
   ```js
   export const supabase =
     supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
   ```
2. **Set env di Vercel Dashboard** → Settings → Environment Variables
3. **Guard di semua komponen** yang pakai `supabase` → cek `if (!supabase)` sebelum query

### File yang diubah
- `src/lib/supabase.js` — tambah null guard
- `src/pages/Dashboard.jsx` — tambah null check sebelum fetch
- `src/pages/focus.jsx` — tambah null check sebelum insert

### Commit
- `01bc892` — fix: guard supabase client against missing env vars

---

## Error #2: Session Data Tidak Masuk Supabase Setelah Stop

**Tanggal:** 15 Maret 2026  
**Severity:** High  
**Halaman:** /focus → handleStop()

### Gejala
- User klik STOP setelah sesi 25 detik
- Redirect ke Dashboard berhasil
- Tapi data session TIDAK muncul di Supabase

### Penyebab (Kemungkinan Besar)
**Row Level Security (RLS)** — Supabase secara default mengaktifkan RLS pada tabel baru. Tanpa policy yang mengizinkan `anon` role untuk INSERT, semua insert dari frontend client (yang pakai anon key) akan **ditolak secara diam-diam**.

Selain itu:
- Error hanya di-log ke `console.error()` — user tidak tahu insert gagal
- `window.location.href = "/dashboard"` dijalankan **sebelum insert selesai** (race condition)

### Solusi
1. **Tambah RLS policy** di Supabase SQL Editor:
   ```sql
   ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Allow anon insert" ON focus_sessions
     FOR INSERT TO anon WITH CHECK (true);

   CREATE POLICY "Allow anon select" ON focus_sessions
     FOR SELECT TO anon USING (true);
   ```
2. **Ubah error handling** — tampilkan `alert()` bukan hanya `console.error()`
3. **Tunggu insert selesai** sebelum redirect — hanya navigate kalau sukses
4. **Tambah tombol SAVING...** untuk mencegah double-click

### File yang diubah
- `src/pages/focus.jsx` — rewrite handleStop() dengan await, alert, saving state
- `backend/supabase/migrations/001_create_focus_sessions.sql` — tambah RLS policy

### Commit
- `f1318c4` — fix: add error visibility on session save + RLS policy for Supabase

---

## Error #3: Dashboard Menampilkan "0 min" untuk Sesi Pendek

**Tanggal:** 15 Maret 2026  
**Severity:** Medium  
**Halaman:** /dashboard

### Gejala
- Session tercatat di Supabase (task: "anton", 31 detik)
- Dashboard menampilkan "Focus: 0 min | Distracted: 0 min"
- User bingung karena data seperti tidak terekam

### Penyebab
Waktu ditampilkan dalam menit menggunakan `Math.floor(seconds / 60)`. Untuk sesi < 60 detik, hasilnya selalu 0.

```js
// Kode lama — kehilangan presisi untuk sesi pendek
Focus: {Math.floor((s.focus_time || 0) / 60)} min
```

### Solusi
Buat fungsi `formatTime()` yang menampilkan dalam format adaptif:
- `< 60s` → `"25s"`
- `>= 60s` → `"1m 30s"`
- `>= 3600s` → `"1h 5m 20s"`

```js
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
```

### File yang diubah
- `src/pages/Dashboard.jsx` — rewrite dengan formatTime(), focus score, today/all-time stats

### Commit
- `1b494a0` — feat: improve Dashboard with accurate time display, focus score, today stats

---

## Proses Pengembangan — Tahap Supabase Integration

### Timeline (15 Maret 2026)

| Step | Aksi | Status |
|------|------|--------|
| 1 | Migrasi dari localStorage ke Supabase langsung (tanpa backend API) | ✅ |
| 2 | Install `@supabase/supabase-js` di frontend | ✅ |
| 3 | Buat `src/lib/supabase.js` — Supabase client via `import.meta.env` | ✅ |
| 4 | Update `focus.jsx` — ganti `fetch()` ke backend dengan `supabase.insert()` | ✅ |
| 5 | Update `Dashboard.jsx` — ganti localStorage read dengan `supabase.select()` | ✅ |
| 6 | Hapus `backend/.env` dari tracking (security) | ✅ |
| 7 | Update `.gitignore` — exclude semua `.env` files | ✅ |
| 8 | Deploy ke Vercel → **layar putih** (Error #1) | ⚠️ |
| 9 | Fix: guard supabase client + set env di Vercel | ✅ |
| 10 | Test insert → **data tidak masuk** (Error #2) | ⚠️ |
| 11 | Fix: RLS policy + error visibility + await insert | ✅ |
| 12 | Fix: Dashboard menampilkan 0 min (Error #3) | ✅ |
| 13 | Dashboard rewrite — format waktu, score, stats | ✅ |

### Keputusan Arsitektur

**Kenapa Supabase langsung dari frontend (bukan via backend API)?**
- MVP lebih cepat — tidak perlu maintain Express server
- Supabase JS client sudah handle auth, RLS, dan REST
- Backend Express tetap ada di repo untuk pengembangan selanjutnya (auth, cron, dll)
- RLS policy menjaga keamanan data di level database

### Pelajaran yang Didapat
1. **Selalu set env di platform deploy** — `.env` lokal tidak otomatis ke Vercel
2. **Guard external dependencies** — jangan biarkan app crash karena 1 service unavailable
3. **Tampilkan error ke user** — `console.error()` saja tidak cukup untuk debugging production
4. **Tunggu async selesai** — jangan redirect sebelum data tersimpan
5. **RLS adalah default Supabase** — selalu buat policy setelah buat tabel
6. **Format waktu harus adaptif** — jangan asumsi semua user pakai sesi >1 menit
