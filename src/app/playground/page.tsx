"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MODELS_2027 } from "@/lib/models";
function Inner(){
  const sp=useSearchParams(); const [model,setModel]=useState(sp.get("model")||"lytoos/auto-free");
  const [apiKey,setApiKey]=useState(""); const [input,setInput]=useState("Halo Lytoos, jelaskan apa itu auto-fallback dalam 2 kalimat."); const [out,setOut]=useState(""); const [meta,setMeta]=useState(""); const [loading,setLoading]=useState(false);
  useEffect(()=>{ setApiKey(localStorage.getItem("lytoos_key")||""); },[]);
  async function run(){
    if(!apiKey.trim()){ setOut("Mode asli aktif: Playground sekarang butuh Lytoos API key. Buat key gratis di halaman Keys, tempel di kolom di atas, lalu kirim lagi."); return; }
    localStorage.setItem("lytoos_key", apiKey.trim());
    setLoading(true); setOut("");
    const r=await fetch("/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${apiKey.trim()}`},body:JSON.stringify({model,messages:[{role:"user",content:input}]})});
    const j=await r.json(); setLoading(false);
    setOut(j.choices?.[0]?.message?.content || j.error?.message || JSON.stringify(j,null,2));
    setMeta(j.lytoos?`Model dipakai: ${j.model} • Fallback chain: ${j.lytoos.fallback_chain?.join(", ")||"none"} • Auto-fallback: ${j.lytoos.auto_fallback}`:"");
  }
  return <div className="mx-auto max-w-3xl">
    <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
    <p className="mt-2 leading-relaxed text-zinc-400">Tes model apa pun dalam mode asli. Kalau provider utama kena rate-limit (429), Lytoos otomatis pindah ke fallback — perhatikan label di bawah jawaban.</p>
    <div className="card mt-6 p-5">
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Lytoos API Key</label>
      <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-lytoos-… (buat gratis di /keys, tersimpan hanya di browser ini)" className="input mt-2 w-full font-mono"/>
      <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Model</label>
      <select value={model} onChange={e=>setModel(e.target.value)} className="input mt-2 w-full">{MODELS_2027.map(m=><option key={m.id} value={m.id}>{m.name} — {m.id}</option>)}</select>
      <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Message</label>
      <textarea value={input} onChange={e=>setInput(e.target.value)} rows={4} className="input mt-2 w-full leading-relaxed"/>
      <button onClick={run} disabled={loading} className="btn-primary mt-5 w-full sm:w-auto">{loading?"Mengirim… (mencoba provider + fallback)":"Send message"}</button>
    </div>
    {out && <div className="card mt-5 whitespace-pre-wrap p-5 text-sm leading-relaxed">{out}{meta && <div className="mt-4 border-t border-white/[0.07] pt-3 text-xs text-emerald-400">{meta}</div>}</div>}
  </div>;
}
export default function Page(){ return <Suspense><Inner/></Suspense>; }
