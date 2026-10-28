import { NextRequest, NextResponse } from "next/server";
import { generateLytoosKey, supabaseAdmin } from "@/lib/keys";
import { PROVIDERS } from "@/lib/models";

// GET /api/keys -> status provider (apakah key server sudah terisi, tanpa menampilkan key) + daftar Lytoos keys (prefix saja)
export async function GET(){
  const providers = Object.entries(PROVIDERS).map(([id,p])=>({
    id, name:p.name, freeUrl:p.freeUrl,
    configured: p.envKey.some(k=>!!process.env[k]),
    env: p.envKey[0],
  }));
  const sb = supabaseAdmin();
  let keys:any[] = [];
  if (sb) { const { data } = await sb.from("api_keys").select("id,name,key_prefix,created_at,last_used_at,revoked").order("created_at",{ascending:false}).limit(50); keys=data||[]; }
  return NextResponse.json({ providers, keys, supabase_connected: !!sb, demo_mode: process.env.LYTOOS_DEMO_MODE==="1" });
}
// POST /api/keys { name } -> buat Lytoos key baru (ditampilkan SEKALI)
export async function POST(req:NextRequest){
  const { name } = await req.json().catch(()=>({name:"My Lytoos Key"}));
  const k = generateLytoosKey();
  const sb = supabaseAdmin();
  if (sb) {
    const { error } = await sb.from("api_keys").insert({ name: name||"My Lytoos Key", key_prefix:k.prefix, key_hash:k.hash });
    if (error) return NextResponse.json({ error:error.message }, { status:500 });
  }
  return NextResponse.json({ key:k.raw, prefix:k.prefix, name:name||"My Lytoos Key", warning:"Simpan key ini sekarang, tidak akan ditampilkan lagi. Tanpa Supabase, key hanya valid di mode lokal/demo.", stored_in_supabase: !!sb });
}
