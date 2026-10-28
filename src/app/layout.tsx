import "./globals.css";
export const metadata = { title:"Lytoos AI - Free Multi-Provider AI Gateway", description:"OpenRouter-compatible gateway: Muse Spark, Agnes, Gemini, DeepSeek, Kimi, GPT-6 Astra, Seedance 2.5. Gratis, BYOK, auto-fallback." };
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="id"><body>
    <header className="border-b border-white/10 sticky top-0 bg-[#0b0b12]/90 backdrop-blur z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="font-bold text-xl">⚡ Lytoos <span className="text-violet-400">AI</span></a>
        <nav className="flex gap-4 text-sm text-zinc-300">
          <a href="/" className="hover:text-white">Models 2027</a>
          <a href="/playground" className="hover:text-white">Playground</a>
          <a href="/keys" className="hover:text-white">Keys</a>
          <a href="/docs" className="hover:text-white">Docs API</a>
        </nav>
      </div>
    </header>
    <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    <footer className="max-w-6xl mx-auto px-4 py-8 text-xs text-zinc-500">Lytoos AI — Gateway gratis, BYOK, tanpa beli token. Kamu pegang key provider kamu sendiri.</footer>
  </body></html>;
}
