"use client";
import { useEffect, useState } from "react";
export default function KeysPage(){
  const [data,setData]=useState<any>(null); const [name,setName]=useState("My Lytoos Key"); const [newKey,setNewKey]=useState("");
  const load=()=>fetch("/api/keys").then(r=>r.json()).then(setData); useEffect(()=>{load()},[]);
  async function create(){ const r=await fetch("/api/keys",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})}); const j=await r.json(); setNewKey(j.key||j.error); load(); }
  async function revoke(id:string){ await fetch(`/api/keys/${id}`,{method:"DELETE"}); load(); }
  return <div>
    <h1 className="text-3xl font-bold">Key Management — Tanpa Beli Token</h1>
    <p className="text-zinc-400 mt-2 max-w-2xl">Lytoos tidak menjual token. Kamu pakai <b className="text-white">key gratis dari provider langsung</b> (BYOK). Ada 2 jenis key:</p>
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-5"><h3 className="font-bold">1. Lytoos Key (sk-lytoos-...)</h3><p className="text-sm text-zinc-400 mt-1">Key untuk memanggil gateway Lytoos dari aplikasimu. Buat di bawah, gratis.</p>
        <div className="flex gap-2 mt-4"><input value={name} onChange={e=>setName(e.target.value)} className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-sm"/><button onClick={create} className="bg-violet-600 px-4 py-2 rounded-lg text-sm font-semibold">+ Buat Key</button></div>
        {newKey && <div className="mt-3 bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-3 font-mono text-xs break-all">{newKey}<div className="text-emerald-300 mt-1 font-sans">Simpan sekarang — hanya tampil sekali.</div></div>}
        <div className="mt-4 space-y-2">{data?.keys?.map((k:any)=><div key={k.id} className="flex justify-between bg-zinc-800 rounded-lg px-3 py-2 text-sm"><span>{k.name} • <span className="font-mono text-zinc-400">{k.key_prefix}…</span> {k.revoked&&<span className="text-red-400">(revoked)</span>}</span>{!k.revoked&&<button onClick={()=>revoke(k.id)} className="text-red-400">Revoke</button>}</div>)}</div>
        {!data?.supabase_connected && <p className="text-xs text-amber-400 mt-3">Supabase belum terhubung — key tersimpan lokal/demo. Hubungkan Supabase (lihat README) agar key persisten.</p>}
      </div>
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-5"><h3 className="font-bold">2. Provider Keys (BYOK Gratis)</h3><p className="text-sm text-zinc-400 mt-1">Daftar gratis di provider, lalu set key-nya sebagai Environment Variable di Vercel (Settings → Environment Variables) atau .env.local. Jangan taruh di chat / git.</p>
        <div className="mt-4 space-y-2">{data?.providers?.map((p:any)=><div key={p.id} className="flex justify-between items-center bg-zinc-800 rounded-lg px-3 py-2 text-sm"><span>{p.name}<div className="font-mono text-xs text-zinc-500">{p.env}=••••</div></span><span className="flex items-center gap-3"><span className={p.configured?"text-emerald-400":"text-zinc-500"}>{p.configured?"✓ Terisi":"Belum diisi"}</span><a className="text-violet-300 hover:underline" href={p.freeUrl} target="_blank">Dapat Gratis ↗</a></span></div>)}</div>
      </div>
    </div>
  </div>;
}
