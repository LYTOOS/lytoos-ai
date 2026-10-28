export default function Docs(){
  const code=`from openai import OpenAI

client = OpenAI(
  base_url="https://LYTOOS-KAMU.vercel.app/api/v1",
  api_key="sk-lytoos-xxxx",  # buat gratis di /keys
)

resp = client.chat.completions.create(
  model="lytoos/auto-free",  # atau lytoos/muse-spark-1.2-free, lytoos/kimi-k2.6-free, dst.
  messages=[{"role":"user","content":"Halo!"}],
)
print(resp.choices[0].message.content)
# Header respon: X-Lytoos-Model (model yang akhirnya dipakai), X-Lytoos-Fallback-Chain`;
  const curl=`curl https://LYTOOS-KAMU.vercel.app/api/v1/chat/completions \\
  -H "Authorization: Bearer sk-lytoos-xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"lytoos/gemini-flash","messages":[{"role":"user","content":"Halo"}]}'

# Video Seedance 2.5:
curl https://LYTOOS-KAMU.vercel.app/api/v1/videos/generations \\
  -H "Authorization: Bearer sk-lytoos-xxxx" -H "Content-Type: application/json" \\
  -d '{"model":"lytoos/seedance-2.5","prompt":"kucing astronot di Jakarta, sinematik","duration":5}'`;
  return <div><h1 className="text-3xl font-bold">Docs API — OpenRouter Compatible</h1>
  <p className="text-zinc-400 mt-2">Semua SDK OpenAI & OpenRouter kompatibel. Endpoint: <code className="text-violet-300">GET /api/v1/models</code>, <code className="text-violet-300">POST /api/v1/chat/completions</code> (support stream), <code className="text-violet-300">POST /api/v1/videos/generations</code>.</p>
  <h2 className="font-bold mt-8 mb-2">Python / OpenAI SDK</h2><pre className="bg-zinc-900 border border-white/10 rounded-xl p-4 overflow-x-auto text-sm">{code}</pre>
  <h2 className="font-bold mt-8 mb-2">cURL</h2><pre className="bg-zinc-900 border border-white/10 rounded-xl p-4 overflow-x-auto text-sm">{curl}</pre>
  <h2 className="font-bold mt-8 mb-2">Auto-Fallback</h2><p className="text-zinc-400 text-sm">Trigger: HTTP 429 / 402 / 408 / 5xx / timeout / key kosong. Model masuk cooldown 60 detik, request diteruskan ke fallback berikutnya. Non-trigger: 400 (request salah) langsung dikembalikan. Pakai <code>lytoos/auto-free</code> untuk routing otomatis penuh.</p>
  </div>;
}
