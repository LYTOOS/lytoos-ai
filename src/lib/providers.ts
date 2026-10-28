import { LytoosModel, PROVIDERS } from "./models";

export function getProviderKey(model: LytoosModel, userKeys?: Record<string,string>) {
  const p = PROVIDERS[model.provider];
  if (userKeys) for (const k of p.envKey) if (userKeys[k]) return userKeys[k];
  for (const k of p.envKey) if (process.env[k]) return process.env[k]!;
  return null;
}
export function getBaseUrl(model: LytoosModel) {
  const p = PROVIDERS[model.provider];
  return process.env[p.baseUrlEnv] || p.defaultBase;
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
  return { content, modelUsed: model.id, provider: model.provider, status: 200, raw: json };
}

function demoReply(model: LytoosModel, body:any): ChatResult {
  const last = [...(body.messages||[])].reverse().find((m:any)=>m.role==="user")?.content || "halo";
  return {
    content: `[Lytoos DEMO - ${model.name}] Saya menerima: "${String(last).slice(0,200)}".\n\nIni jawaban simulasi karena belum ada provider key. Tambahkan key GRATIS kamu di halaman Keys (Gemini AI Studio / DeepSeek / Kimi / Agnes) atau set di Vercel Env, lalu demo mode otomatis memakai provider asli. Sistem fallback, routing & format OpenRouter-compatible sudah aktif penuh.`,
    modelUsed: model.id, provider: model.provider, status: 200,
  };
}
