# ⚡ Lytoos AI — Free Multi-Provider AI Gateway (2027)

OpenRouter-compatible AI gateway, **gratis & BYOK (Bring Your Own Key)** — tanpa beli token.
Satu API untuk: **Muse Spark 1.2 Free, Agnes 2.0, Gemini 3 Flash, DeepSeek V4/R2, Kimi K2.6, ChatGPT-6 Astra, Seedance 2.5 (video)**.

## Fitur
- ✅ **OpenRouter / OpenAI compatible**: `GET /api/v1/models`, `POST /api/v1/chat/completions` (streaming), `POST /api/v1/videos/generations`
- 🔍 **Search & filter model** (nama, provider, capability: chat/reasoning/code/vision/video) — 16 model katalog 2027
- 🔁 **Auto-fallback**: 429 (rate-limit) / 402 / 408 / 5xx / timeout / key kosong → pindah otomatis ke model fallback + cooldown 60 dtk per model. Header: `X-Lytoos-Model`, `X-Lytoos-Fallback-Chain`
- 🔑 **Key management sendiri**: buat/revoke `sk-lytoos-...` (hanya hash SHA-256 disimpan) + panel status Provider Keys BYOK
- 🆓 **Tanpa beli token**: pakai free-tier provider langsung — Gemini (AI Studio gratis), DeepSeek, Kimi/Moonshot, Agnes, dll.
- 🗄️ **Supabase**: tabel `api_keys`, `provider_keys`, `usage_logs` + RLS (file `supabase/schema.sql`)
- 🚀 **Deploy 1-klik ke Vercel** + Supabase gratis

## Jalankan Lokal
```bash
npm install
cp .env.example .env.local   # isi minimal LYTOOS_DEMO_MODE=1 untuk coba tanpa key
npm run dev                  # http://localhost:3000
```
Coba: buka `/` (search model), `/playground` (chat + lihat fallback), `/keys` (buat key), `/docs`.

## Deploy ke Vercel + Supabase (perlu akun kamu — 10 menit)

### 1. Supabase (gratis)
1. Buat project di https://supabase.com/dashboard
2. **SQL Editor → New Query** → tempel isi `supabase/schema.sql` → **Run**
3. **Project Settings → API**: salin `Project URL`, `anon key`, `service_role key`

### 2. Vercel
1. Push folder ini ke GitHub kamu, lalu https://vercel.com/new → Import repo → Deploy
   *atau tanpa GitHub:* `npm i -g vercel && vercel --prod` dari folder ini
2. Di Vercel Project → **Settings → Environment Variables**, isi:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `LYTOOS_ENCRYPTION_SECRET` (random panjang)
   - `LYTOOS_DEMO_MODE=1` (matikan `0` setelah provider key asli terisi)
   - Provider keys yang kamu punya (semua opsional): `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, `KIMI_API_KEY`, `AGNES_API_KEY`, `OPENAI_API_KEY`, `MUSE_API_KEY`, `SEEDANCE_API_KEY`
3. **Redeploy** setelah menambah env.

### 3. Pakai dari aplikasi lain
```python
from openai import OpenAI
client = OpenAI(base_url="https://<domain-vercel-kamu>/api/v1", api_key="sk-lytoos-...")
client.chat.completions.create(model="lytoos/auto-free", messages=[{"role":"user","content":"Halo"}])
```

## Catatan jujur soal model 2027
Nama model di katalog adalah **ID gateway Lytoos** yang dipetakan ke `upstream` di `src/lib/models.ts`.
Kalau nama upstream provider berubah / belum tersedia di akunmu, ubah field `upstream` saja — routing, fallback & API tetap sama.
Seedance memakai endpoint video terpisah karena outputnya video, bukan chat.

## Struktur
```
src/lib/models.ts     # katalog 2027 + pemetaan provider
src/lib/providers.ts  # adapter OpenAI-compatible per provider + demo mode
src/lib/fallback.ts   # mesin auto-fallback + circuit breaker
src/lib/keys.ts       # generate/hash/validasi key + Supabase admin + usage log
src/app/api/v1/       # API OpenRouter-compatible
src/app/              # UI: models+search, playground, keys, docs
supabase/schema.sql   # skema DB
```
