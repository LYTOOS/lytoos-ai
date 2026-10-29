# Draft Patch Router v2 — BELUM DI-DEPLOY

Status: draft lokal di `~/workspace/lytoos-ai`, disetujui user 2026-10-29 ("Siapkan draft patch routernya (tanpa deploy dulu)") + permintaan tambahan: setiap AI memakai gambar/logo aslinya, bukan inisial.

## Isi patch
1. `src/lib/models.ts` (tulis ulang)
   - Provider baru (slot BYOK): OpenRouter, Groq, Cloudflare Workers AI, Z.ai (GLM), NVIDIA NIM — total 12 provider, masing-masing dengan `logo`.
   - 6 model virtual: `lytoos/auto`, `lytoos/code`, `lytoos/reasoning`, `lytoos/vision`, `lytoos/fast`, `lytoos/image` + rantai fallback antar-provider persis hasil riset (CHAIN_CHAT/CODE/REASONING/VISION/FAST/IMAGE).
   - 25+ model nyata baru dengan ID upstream persis riset (Gemini 3.8 Flash, Inkling :free, Nemotron Ultra :free, GPT-OSS di Groq, GLM Flash $0, Kimi K3 via NIM, FLUX.1 Schnell via Cloudflare, dll). Total katalog 44 entri.
   - DeepSeek/Kimi langsung: `status:"dead"`, `free:false` — dikeluarkan dari semua rantai.
   - Seedance: `status:"trial"`, `free:false` (tidak ada API video gratis tetap).
   - Entri klaim 2027 lama (Muse Spark, Agnes, GPT-6 Astra): `status:"trial"` (belum terverifikasi riset).
2. `src/lib/providers.ts` — HTTP 200 body kosong dianggap gagal (picu fallback); base URL Cloudflare mengganti `{ACCOUNT_ID}` dari env `CLOUDFLARE_ACCOUNT_ID`/`CF_ACCOUNT_ID`.
3. `src/lib/fallback.ts` — rantai dibangun dari model yang diminta + fallback-nya; model `dead` selalu dilewati.
4. Logo asli tiap provider di `public/logos/` (diunduh & diverifikasi format gambarnya):
   gemini.svg, openrouter.svg, groq.webp, nvidia.svg (NIM), zai.svg, cloudflare.svg, muse.svg (Meta), agnes.png, deepseek.svg, kimi.svg, openai.png, seedance.svg (ByteDance).
   Sumber: Simple Icons CDN untuk sebagian besar; Z.ai dari manifest.build; OpenAI dari freebiesupply; Groq dari logowik; Agnes dari ikon aplikasi Play Store.
5. UI: kartu model di homepage memakai logo asli provider dalam ubin putih (bukan inisial), badge status FREE/TRIAL/NONAKTIF, statistik jumlah model & provider dinamis; halaman Keys menampilkan logo di tiap baris provider; `/api/keys` kini mengembalikan field `logo`.

## Yang masih dibutuhkan sebelum/saat deploy
- Key gratis user untuk provider baru (OpenRouter, Groq, Cloudflare + Account ID, Z.ai, NVIDIA) — tanpa itu rantai praktis hanya berjalan lewat Gemini yang sudah terisi.
- Verifikasi ulang ID `:free` OpenRouter mendekati hari deploy (riset menyarankan re-validasi mingguan; Poolside :free berakhir 31 Okt 2026 dan memang tidak dimasukkan).
- Deploy = commit file-file ini ke GitHub main + redeploy Vercel (kemungkinan perlu Force Promote seperti sebelumnya).
