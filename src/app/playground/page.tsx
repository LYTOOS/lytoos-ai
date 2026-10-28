"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MODELS_2027 } from "@/lib/models";
function Inner(){
  const sp=useSearchParams(); const [model,setModel]=useState(sp.get("model")||"lytoos/auto-free");
  const [input,setInput]=useState("Halo Lytoos, jelaskan apa itu auto-fallback dalam 2 kalimat."); const [out,setOut]=useState(""); const [meta,setMeta]=useState(""); const [loading,setLoading]=useState(false);
  async function run(){
    setLoading(true); setOut("");
    const r=await fetch("/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model,messages:[{role:"user",content:input}]})});
    const j=await r.json(); setLoading(false);
    setOut(j.choices?.[0]?.message?.content || j.error?.message || JSON.stringify(j,null,2));
    setMeta(j.lytoos?`Model dipakai: ${j.model} • Fallback chain: ${j.lytoos.fallback_chain?.join(", ")||"none"} • Auto-fallback: ${j.lytoos.auto_fallback}`:"");
  }
  return <div>
    <h1 className="text-3xl font-bold">Playground</h1><p className="text-zinc-400 mt-2">Tes model apapun. Kalau provider utama rate-limit (429), Lytoos otomatis pindah ke fallback — perhatikan label di bawah jawaban.</p>
    <select value={model} onChange={e=>setModel(e.target.value)} className="w-full mt-6 bg-zinc-900 border border-white/10 rounded-lg px-3 py-3">{MODELS_2027.map(m=><option key={m.id} value={m.id}>{m.name} — {m.id}</option>)}</select>
    <textarea value={input} onChange={e=>setInput(e.target.value)} rows={4} className="w-full mt-3 bg-zinc-900 border border-white/10 rounded-lg px-4 py-3"/>
    <button onClick={run} disabled={loading} className="mt-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold">{loading?"Mengirim… (mencoba provider + fallback)":"Kirim"}</button>
    {out && <div className="mt-6 bg-zinc-900 border border-white/10 rounded-xl p-5 whitespace-pre-wrap text-sm">{out}<div className="text-xs text-emerald-400 mt-4">{meta}</div></div>}
  </div>;
}
export default function Page(){ return <Suspense><Inner/></Suspense>; }
