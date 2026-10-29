import "./globals.css";
import Logo from "@/components/Logo";
export const metadata = {
  title: "Lytoos AI — The Free AI Gateway",
  description: "One API for every free AI model. OpenRouter-compatible, auto-fallback, BYOK. Muse Spark, Gemini, DeepSeek, Kimi, GPT-6 Astra & Seedance.",
  icons: { icon: "/logo.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body className="min-h-screen">
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#06060a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
        <a href="/" aria-label="Lytoos AI home"><Logo /></a>
        <nav className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.03] p-1 text-[13px] font-medium text-zinc-400 md:flex">
          <a href="/" className="rounded-full px-4 py-1.5 transition hover:bg-white/[0.06] hover:text-white">Models</a>
          <a href="/playground" className="rounded-full px-4 py-1.5 transition hover:bg-white/[0.06] hover:text-white">Playground</a>
          <a href="/keys" className="rounded-full px-4 py-1.5 transition hover:bg-white/[0.06] hover:text-white">Keys</a>
          <a href="/docs" className="rounded-full px-4 py-1.5 transition hover:bg-white/[0.06] hover:text-white">Docs</a>
        </nav>
        <a href="/keys" className="btn-primary hidden sm:inline-flex">Get API Key</a>
        <nav className="flex gap-4 text-sm text-zinc-400 md:hidden">
          <a href="/playground">Playground</a><a href="/keys">Keys</a><a href="/docs">Docs</a>
        </nav>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center">
        <Logo size={30} />
        <p>One API for every free AI model. Bring your own key — no tokens to buy.</p>
        <p className="text-xs">© 2026 Lytoos AI</p>
      </div>
    </footer>
  </body></html>;
}
