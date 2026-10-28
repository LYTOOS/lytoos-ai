# Panduan Deploy Lytoos AI — Vercel + Supabase
### Total ±10-15 menit • Semua gratis • Ikuti urutan ini, jangan loncat

> Yang kamu butuhkan: akun GitHub, Vercel, dan Supabase (semua bisa daftar gratis pakai Google).
> Jangan kirim API key / password apapun ke chat — isi langsung di dashboard Vercel/Supabase.

---

## LANGKAH 1 — Supabase (±4 menit)

1. Buka https://supabase.com/dashboard → **New project**
   - Name: `lytoos-ai`
   - Database Password: buat & **simpan di password manager kamu** (ini bukan untuk Lytoos, hanya untuk DB)
   - Region: **Singapore (Southeast Asia)** — paling dekat dari Indonesia
   - Klik **Create new project**, tunggu sampai statusnya ready (±2 menit)
2. Di project itu: menu kiri **SQL Editor → New query**
   - Buka file `supabase/schema.sql` dari project ini, **copy semua isinya**, tempel, klik **Run**
   - Berhasil kalau muncul "Success. No rows returned" dan di **Table Editor** ada 3 tabel: `api_keys`, `provider_keys`, `usage_logs`
3. Menu kiri paling bawah **Project Settings → API** — biarkan tab ini terbuka, 3 nilai ini dipakai di Langkah 3:
   - `Project URL` → jadi `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → jadi `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (klik Reveal) → jadi `SUPABASE_SERVICE_ROLE_KEY` ⚠️ rahasia, jangan share ke siapa pun

## LANGKAH 2 — Upload kode ke GitHub (pilih salah satu)

**Cara A — GitHub web (tanpa terminal, paling mudah):**
1. https://github.com/new → Repository name: `lytoos-ai` → **Create repository**
2. Klik **uploading an existing file** → drag semua isi folder `lytoos-ai` (hasil extract zip — isinya ada `package.json`, `src/`, `supabase/`, bukan folder di dalam folder)
3. **Commit changes**

**Cara B — Terminal:**
```bash
cd lytoos-ai
git init && git add . && git commit -m "Lytoos AI v1"
git branch -M main
git remote add origin https://github.com/<username-kamu>/lytoos-ai.git
git push -u origin main
```

## LANGKAH 3 — Vercel (deploy + isi env)

1. https://vercel.com/new → **Import** repo `lytoos-ai` → Framework otomatis terdeteksi **Next.js**, jangan ubah apa pun → tapi **sebelum klik Deploy, buka bagian Environment Variables** dan isi tabel di bawah.
2. Isi env ini satu per satu (Name = persis seperti ini, Value = dari Langkah 1 / provider):

| Name | Value | Wajib? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key Supabase | ✅ |
| `LYTOOS_ENCRYPTION_SECRET` | teks random 32+ karakter, ciptakan sendiri | ✅ |
| `LYTOOS_DEMO_MODE` | `1` | ✅ untuk tes pertama |
| `GEMINI_API_KEY` | dari https://aistudio.google.com/apikey (gratis) | ⭐ sangat disarankan |
| `DEEPSEEK_API_KEY` | dari platform.deepseek.com | opsional |
| `KIMI_API_KEY` | dari platform.moonshot.ai | opsional |
| `AGNES_API_KEY` | dari agnes.ai | opsional |
| `OPENAI_API_KEY` / `MUSE_API_KEY` / `SEEDANCE_API_KEY` | kalau kamu punya | opsional |

3. Klik **Deploy**. Tunggu ±1-2 menit sampai muncul domain, contoh: `https://lytoos-ai-xxx.vercel.app`

> Kalau kamu menambah/mengubah env **setelah** deploy: Vercel Project → Settings → Environment Variables → simpan → tab **Deployments** → titik tiga → **Redeploy**. Env baru tidak aktif tanpa redeploy.

## LANGKAH 4 — Verifikasi (cek 4 hal ini, ±2 menit)

Ganti `DOMAIN` dengan domain Vercel kamu:

1. **Homepage:** buka `https://DOMAIN/` → harus muncul daftar model + search
2. **Health:** buka `https://DOMAIN/api/health` → harus `{"status":"ok","models":16,...}`
3. **Models API:** buka `https://DOMAIN/api/v1/models` → JSON 16 model
4. **Chat + fallback:** buka `https://DOMAIN/playground` → pilih `lytoos/auto-free` → kirim "Halo" → jawaban muncul + label model yang dipakai. Masih demo? Itu normal selama `LYTOOS_DEMO_MODE=1` dan belum ada provider key asli.
5. **Buat key:** buka `https://DOMAIN/keys` → Buat Key → simpan `sk-lytoos-...`-nya. Kalau Supabase benar, key ini tersimpan (cek di Supabase → Table Editor → `api_keys`).

Tes dari terminal (opsional):
```bash
curl https://DOMAIN/api/v1/chat/completions \
  -H "Authorization: Bearer sk-lytoos-KEY-KAMU" -H "Content-Type: application/json" \
  -d '{"model":"lytoos/auto-free","messages":[{"role":"user","content":"Halo Lytoos!"}]}'
```

## LANGKAH 5 — Go-live (setelah Gemini/provider key asli terisi)

1. Vercel → Settings → Environment Variables → ubah `LYTOOS_DEMO_MODE` menjadi `0`
2. Redeploy (Deployments → Redeploy)
3. Tes lagi di Playground — jawaban sekarang dari provider asli, bukan simulasi

---

## Troubleshooting cepat

| Gejala | Penyebab & solusi |
|---|---|
| Build gagal di Vercel | Pastikan `package.json` ada di root repo (bukan di dalam folder ganda `lytoos-ai/lytoos-ai`) |
| `/keys` bilang "Supabase belum terhubung" | Salah satu dari 3 env Supabase kosong/salah, atau belum Redeploy setelah isi env |
| Chat selalu demo | `LYTOOS_DEMO_MODE` masih `1` **atau** belum ada provider key yang terisi — itu memang desainnya |
| Chat error 401 "No API key for provider" | Isi minimal `GEMINI_API_KEY` (paling mudah & gratis), lalu Redeploy |
| Semua model 429 | Free-tier provider sedang limit — fallback akan mencoba model lain; tunggu 1 menit (cooldown) atau tambah provider key lain |
| SQL Run error di Supabase | Jalankan ulang seluruh `schema.sql` sekaligus (file ini idempotent: aman di-run berkali-kali kecuali policy — kalau error policy "already exists", abaikan/hapus baris policy itu) |

## Setelah deploy berhasil
Kirim domain Vercel kamu ke Muse di chat ini — nanti Muse bantu: (1) cek live dari sini, (2) tes fallback dengan key kamu, (3) catat domain sebagai alamat resmi Lytoos AI kamu.
