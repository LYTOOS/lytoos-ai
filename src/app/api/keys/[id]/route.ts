import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/keys";
// DELETE /api/keys/[id] -> revoke
export async function DELETE(_req:NextRequest, { params }:{ params:{ id:string } }){
  const sb = supabaseAdmin(); if(!sb) return NextResponse.json({error:"Supabase belum terhubung"},{status:400});
  const { error } = await sb.from("api_keys").update({ revoked:true }).eq("id", params.id);
  if (error) return NextResponse.json({ error:error.message },{status:500});
  return NextResponse.json({ ok:true, revoked:params.id });
}
