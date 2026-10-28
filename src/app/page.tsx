"use client";
import { useMemo, useState } from "react";
import { MODELS_2027, PROVIDERS } from "@/lib/models";

export default function Home(){
  const [q,setQ]=useState(""); const [prov,setProv]=useState(""); const [cap,setCap]=useState("");
  const [copied,setCopied]=useState("");
  const list=useMemo(()=>MODELS_2027.filter(m=>{
    const s=q.toLowerCase(); const hit=!s||[m.id,m.name,m.providerName,m.description,m.tags.join(" ")].join(" ").toLowerCase().includes(s);
    return hit && (!prov||m.provider===prov) && (!cap||m.capabilities.includes(cap as any));
  }),[q,prov,cap]);

  return <div>
    <h1 className="text-4xl font-extrabold">Satu API. <span className="text-violet-400">Semua model gratis 2027.</span></h1>
    <p className="text-zinc-400 mt-3 max-w-2xl">OpenRouter-compatible gateway dengan auto-fallback saat rate-limit. Muse Spark 1.2 Free, Agnes, Gemini Flash, DeepSeek, Kimi, ChatGPT-6 Astra & Seedance 2.5 — tanpa beli token, pakai key gratis kamu sendiri (BYOK).</p>

    <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 mt-6 font-mono text-sm overflow-x-auto">
      <div className="text-zinc-500"># Ganti base_url saja, kode OpenAI/OpenRouter kamu langsung jalan</div>
      base_url = <span className="text-violet-300">"https://lytoos-ai.vercel.app/api/v1"</span> <br/>api_key = <span className="text-violet-300">"sk-lytoos-..."</span> <span className="text-zinc-500"># buat gratis di /keys</span><br/>model = <span className="text-violet-300">"lytoos/auto-free"</span> <span className="text-zinc-500"># auto pilih yang tidak rate-limit</span>
    </div>

    <div className="flex flex-col md:flex-row gap-3 mt-8">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Search model… coba: muse, kimi, video, reasoning, coding" className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-violet-500"/>
      <select value={prov} onChange={e=>setProv(e.target.value)} className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-3">
        <option value="">Semua Provider</option>
        {Object.entries(PROVIDERS).map(([id,p])=><option key={id} value={id}>{p.name}</option>)}
      </select>
      <select value={cap} onChange={e=>setCap(e.target.value)} className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-3">
        <option value="">Semua Kemampuan</option><option value="chat">Chat</option><option value="reasoning">Reasoning</option><option value="code">Code</option><option value="vision">Vision</option><option value="video">Video</option>
      </select>
    </div>
    <p className="text-sm text-zinc-500 mt-3">{list.length} model ditemukan</p>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {list.map(m=><div key={m.id} className="bg-zinc-900 border border-white/10 rounded-xl p-5 hover:border-violet-500/60 transition">
        <div className="flex justify-between"><span className="text-xs bg-violet-600/20 text-violet-300 px-2 py-1 rounded-full">{m.providerName}</span><span className="text-xs bg-emerald-600/20 text-emerald-300 px-2 py-1 rounded-full">GRATIS • 2027</span></div>
        <h3 className="font-bold mt-3">{m.name}</h3>
        <p className="text-sm text-zinc-400 mt-1 line-clamp-3">{m.description}</p>
        <div className="text-xs text-zinc-500 mt-3">Context {(m.contextLength/1000)}K • {m.capabilities.join(", ")}</div>
        <div className="text-xs text-zinc-500 mt-1">Fallback: {m.fallback.length? m.fallback.map(f=>f.replace("lytoos/","")).join(" → ") : "—"}</div>
        <button onClick={()=>{navigator.clipboard.writeText(m.id);setCopied(m.id);}} className="mt-4 w-full bg-zinc-800 hover:bg-violet-600 rounded-lg py-2 text-sm font-mono">{copied===m.id?"✓ Tersalin!":m.id}</button>
        <a href={`/playground?model=${encodeURIComponent(m.id)}`} className="block text-center mt-2 text-sm text-violet-300 hover:underline">Coba di Playground →</a>
      </div>)}
    </div>
    {list.length===0 && <p className="text-zinc-500 mt-8">Tidak ada model cocok. Coba kata kunci lain.</p>}
  </div>;
}
