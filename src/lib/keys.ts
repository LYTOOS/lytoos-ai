import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
export function hashKey(k:string){ return crypto.createHash("sha256").update(k).digest("hex"); }
export function generateLytoosKey(){
  const raw = "sk-lytoos-" + crypto.randomBytes(24).toString("base64url");
  return { raw, prefix: raw.slice(0,18), hash: hashKey(raw) };
}
/** Validasi Lytoos key: cek Supabase api_keys, fallback ke env LYTOOS_MASTER_KEY / demo-open */
export async function validateLytoosKey(auth?: string|null): Promise<{ok:boolean; keyId?:string}> {
  if (process.env.LYTOOS_DEMO_MODE==="1" && !auth) return { ok:true, keyId:"demo" };
  if (!auth?.startsWith("Bearer ")) return { ok:false };
  const token = auth.slice(7).trim();
  if (process.env.LYTOOS_MASTER_KEY && token===process.env.LYTOOS_MASTER_KEY) return { ok:true, keyId:"master" };
  const sb = supabaseAdmin();
  if (!sb) return { ok: token.startsWith("sk-lytoos-"), keyId:"local" }; // dev tanpa Supabase
  const { data } = await sb.from("api_keys").select("id,revoked").eq("key_hash", hashKey(token)).single();
  if (data && !data.revoked) {
    await sb.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", data.id);
    return { ok:true, keyId:data.id };
  }
  return { ok:false };
}
export async function logUsage(row:any){
  const sb = supabaseAdmin(); if(!sb) return;
  try { await sb.from("usage_logs").insert(row); } catch {}
}
