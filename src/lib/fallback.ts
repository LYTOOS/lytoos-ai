import { findModel } from "./models";
import { callProvider, ChatResult } from "./providers";

// Circuit breaker sederhana (in-memory per instance)
const cooldown = new Map<string, number>(); // modelId -> until epoch ms
const COOLDOWN_MS = 60_000;

export function isCooling(id:string){ return (cooldown.get(id)||0) > Date.now(); }
export function markRateLimited(id:string){ cooldown.set(id, Date.now()+COOLDOWN_MS); }

/**
 * Auto-fallback engine:
 * - Urutan: model diminta -> fallback[] model tsb -> lytoos/auto-free chain
 * - Trigger fallback: HTTP 429, 402, 408, 5xx, timeout, no key
 * - Tidak fallback untuk 400 (request user salah)
 * - Setiap kegagalan dicatat di header X-Lytoos-Fallback-Chain
 */
export async function chatWithFallback(requestedId: string, body:any, userKeys?:Record<string,string>) {
  const req = findModel(requestedId);
  const primary = [req, ...req.fallback.map(findModel)].filter(m=>m.status!=="dead");

  const chain: string[] = [];
  const tried = new Set<string>();
  let lastErr:any = null;

  for (const model of primary) {
    if (tried.has(model.id) || model.capabilities.includes("video")) continue;
    tried.add(model.id);
    if (isCooling(model.id)) { chain.push(`${model.id}:cooldown`); continue; }
    try {
      const r: ChatResult = await callProvider(model, body, userKeys);
      return { ...r, fallbackChain: chain, requested: requestedId };
    } catch(e:any) {
      lastErr = e;
      chain.push(`${model.id}:${e.status||"error"}`);
      if (e.status===429 || e.rateLimit) markRateLimited(model.id);
      if (e.status===400) break; // jangan fallback utk bad request
      continue; // 401(no key)/402/408/5xx/network -> coba model berikutnya
    }
  }
  const err:any = new Error(lastErr?.message || "All free providers rate-limited. Coba lagi 1 menit / tambah provider key lain di /keys.");
  err.status = lastErr?.status || 503; err.chain = chain; throw err;
}
