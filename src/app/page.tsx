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
    <section className="pb-10 pt-6 text-center sm:pt-12">
      <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1.5 text-xs font-medium text-violet-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/> OpenRouter-compatible · Live</span>
      <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">One API for<br/><span className="bg-gradient-to-r from-violet-300 via-violet-400 to-indigo-400 bg-clip-text text-transparent">every free AI model.</span></h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-400">Lytoos merutekan permintaanmu lewat rantai model gratis hasil riset — Gemini, OpenRouter, Groq, NVIDIA NIM, Z.ai, Cloudflare — dan otomatis berpindah provider saat satu kena rate-limit. Tanpa beli token: pakai key gratis kamu sendiri.</p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <a href="/keys" className="btn-primary">Get a free API key</a>
        <a href="/docs" className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold transition hover:bg-white/[0.08]">Read the docs</a>
      </div>
      <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-3 divide-x divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-white/[0.02] py-5">
        <div><dt className="text-2xl font-bold">{MODELS_2027.length}</dt><dd className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Models</dd></div>
        <div><dt className="text-2xl font-bold">{Object.keys(PROVIDERS).length}</dt><dd className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Providers</dd></div>
        <div><dt className="text-2xl font-bold">$0</dt><dd className="mt-1 text-xs uppercase tracking-wider text-zinc-500">Token cost · BYOK</dd></div>
      </dl>
    </section>

    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3"><span className="h-3 w-3 rounded-full bg-[#ff5f57]"/><span className="h-3 w-3 rounded-full bg-[#febc2e]"/><span className="h-3 w-3 rounded-full bg-[#28c840]"/><span className="ml-3 text-xs text-zinc-500">quickstart.py</span></div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-zinc-300">{`from openai import OpenAI

client = OpenAI(
    base_url="https://lytoos-ai.vercel.app/api/v1",
    api_key="sk-lytoos-...",  # gratis, buat di /keys
)

resp = client.chat.completions.create(
    model="lytoos/auto-free",  # auto-pilih yang tidak rate-limit
    messages=[{"role": "user", "content": "Halo, Lytoos!"}],
)`}</pre>
    </div>

    <section className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-2xl font-bold tracking-tight">Models</h2><p className="mt-1 text-sm text-zinc-500">{list.length} dari {MODELS_2027.length} model · semua gratis via BYOK</p></div>
      </div>
      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search models — muse, kimi, video, reasoning…" className="input flex-1"/>
        <select value={prov} onChange={e=>setProv(e.target.value)} className="input md:w-52"><option value="">All providers</option>{Object.entries(PROVIDERS).map(([id,p])=><option key={id} value={id}>{p.name}</option>)}</select>
        <select value={cap} onChange={e=>setCap(e.target.value)} className="input md:w-48"><option value="">All capabilities</option><option value="chat">Chat</option><option value="reasoning">Reasoning</option><option value="code">Code</option><option value="vision">Vision</option><option value="video">Video</option></select>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map(m=><article key={m.id} className="card group p-5 transition duration-300 hover:-translate-y-0.5 hover:border-violet-500/40">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5"><span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5 ring-1 ring-white/20"><img src={PROVIDERS[m.provider].logo} alt={`Logo ${m.providerName}`} className="max-h-full max-w-full object-contain"/></span><span className="text-[13px] font-medium text-zinc-300">{m.providerName}</span></span>
            {m.status==="dead" ? <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-300 ring-1 ring-red-500/25">NONAKTIF</span> : m.status==="trial" ? <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 ring-1 ring-amber-500/25">TRIAL</span> : <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/20">FREE</span>}
          </div>
          <h3 className="mt-4 font-semibold tracking-tight">{m.name}</h3>
          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-zinc-400">{m.description}</p>
          <p className="mt-4 text-xs text-zinc-500">{(m.contextLength/1000).toLocaleString()}K context · {m.capabilities.join(" · ")}</p>
          <button onClick={()=>{navigator.clipboard.writeText(m.id);setCopied(m.id);}} className="mt-4 w-full truncate rounded-lg bg-white/[0.05] px-3 py-2 font-mono text-xs text-zinc-300 ring-1 ring-white/[0.07] transition hover:bg-violet-600 hover:text-white">{copied===m.id?"Copied ✓":m.id}</button>
          <a href={`/playground?model=${encodeURIComponent(m.id)}`} className="mt-3 block text-center text-[13px] font-medium text-violet-300 transition hover:text-violet-200">Try in Playground →</a>
        </article>)}
      </div>
      {list.length===0 && <p className="mt-10 text-center text-zinc-500">Tidak ada model yang cocok. Coba kata kunci lain.</p>}
    </section>
  </div>;
}
