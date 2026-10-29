import { LytoosModel, PROVIDERS } from "./models";

export function getProviderKey(model: LytoosModel, userKeys?: Record<string,string>) {
  const p = PROVIDERS[model.provider];
  if (userKeys) for (const k of p.envKey) if (userKeys[k]) return userKeys[k];
  for (const k of p.envKey) if (process.env[k]) return process.env[k]!;
  return null;
}
export function getBaseUrl(model: LytoosModel) {
  const p = PROVIDERS[model.provider];
  const base = process.env[p.baseUrlEnv] || p.defaultBase;
  // Cloudflare butuh Account ID di path: ganti placeholder {ACCOUNT_ID} dari env bila ada
  return base.replace("{ACCOUNT_ID}", process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CF_ACCOUNT_ID || "");
}

export interface ChatResult { content: string; modelUsed: string; provider: string; status: number; raw?: any; fallbackFrom?: string[] }

export async function callProvider(model: LytoosModel, body: any, userKeys?: Record<string,string>): Promise<ChatResult> {
  const key = getProviderKey(model, userKeys);
  const demo = process.env.LYTOOS_DEMO_MODE === "1";
  if (!key) {
    if (demo) return demoReply(model, body);
    const e:any = new Error(`No API key for provider ${model.provider}. Add it in /keys (BYOK, gratis dari provider).`);
    e.status = 401; e.code = "no_provider_key"; throw e;
  }
  if (model.capabilities.includes("video")) {
    const e:any = new Error("Use /v1/videos/generations for Seedance models");
    e.status = 400; throw e;
  }
  const url = `${getBaseUrl(model)}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type":"application/json", Authorization:`Bearer ${key}` },
    body: JSON.stringify({ ...body, model: model.upstream, stream: false }),
    signal: AbortSignal.timeout(45000),
  });
  const text = await res.text();
  if (!res.ok) {
    const e:any = new Error(`Upstream ${model.provider} ${res.status}: ${text.slice(0,300)}`);
    e.status = res.status; e.rateLimit = res.status===429; throw e;
  }
  const json = JSON.parse(text);
  const content = json.choices?.[0]?.message?.content ?? "";
  // Aturan riset: HTTP 200 dengan body kosong/error (sering terjadi di OpenRouter) = kegagalan -> picu fallback
  if (!content) { const e:any = new Error(`Upstream ${model.provider} returned empty content`); e.status = 502; throw e; }
  return { content, modelUsed: model.id, provider: model.provider, status: 200, raw: json };
}

function demoReply(model: LytoosModel, body:any): ChatResult {
  const last = [...(body.messages||[])].reverse().find((m:any)=>m.role==="user")?.content || "halo";
  return {
    content: `[Lytoos DEMO - ${model.name}] Saya menerima: "${String(last).slice(0,200)}".\n\nIni jawaban simulasi karena belum ada provider key. Tambahkan key GRATIS kamu di halaman Keys (Gemini AI Studio / DeepSeek / Kimi / Agnes) atau set di Vercel Env, lalu demo mode otomatis memakai provider asli. Sistem fallback, routing & format OpenRouter-compatible sudah aktif penuh.`,
    modelUsed: model.id, provider: model.provider, status: 200,
  };
}
