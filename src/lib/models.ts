// Lytoos AI — katalog model v2 (DRAFT PATCH ROUTER, hasil riset model gratis 2026-10-29)
// Perubahan vs v1:
// - Provider baru hasil riset: OpenRouter, Groq, Cloudflare Workers AI, Z.ai, NVIDIA NIM (slot BYOK)
// - 6 model virtual: lytoos/auto, /code, /reasoning, /vision, /fast, /image dengan rantai fallback antar-provider
// - DeepSeek/Kimi langsung ditandai "dead" (tidak ada free tier API langsung; gratis hanya via NIM/OpenRouter)
// - Seedance ditandai "trial" (tidak ada API video gratis tetap)
// - Setiap provider punya logo asli di /logos/<provider>.svg|png (bukan inisial lagi)
export type ProviderId = "muse" | "agnes" | "gemini" | "deepseek" | "kimi" | "openai" | "seedance" | "openrouter" | "groq" | "cloudflare" | "zai" | "nim";
export type Capability = "chat" | "reasoning" | "code" | "vision" | "video" | "image";
export type ModelStatus = "active" | "trial" | "dead";

export interface LytoosModel {
  id: string;
  upstream: string;
  name: string;
  provider: ProviderId;
  providerName: string;
  description: string;
  contextLength: number;
  capabilities: Capability[];
  pricing: { prompt: string; completion: string };
  free: boolean;
  status: ModelStatus;
  year: 2027;
  fallback: string[];
  tags: string[];
}

export const PROVIDERS: Record<ProviderId, { name: string; envKey: string[]; baseUrlEnv: string; defaultBase: string; freeUrl: string; logo: string }> = {
  muse:       { name: "Meta Muse",    envKey: ["MUSE_API_KEY","META_API_KEY"], baseUrlEnv: "MUSE_BASE_URL",     defaultBase: "https://api.meta.ai/v1", freeUrl: "https://www.meta.ai", logo: "/logos/muse.svg" },
  agnes:      { name: "Agnes AI",     envKey: ["AGNES_API_KEY"],               baseUrlEnv: "AGNES_BASE_URL",    defaultBase: "https://api.agnes-ai.com/v1", freeUrl: "https://agnes.ai", logo: "/logos/agnes.png" },
  gemini:     { name: "Google Gemini",envKey: ["GEMINI_API_KEY","GOOGLE_API_KEY"], baseUrlEnv: "GEMINI_BASE_URL", defaultBase: "https://generativelanguage.googleapis.com/v1beta/openai", freeUrl: "https://aistudio.google.com/apikey", logo: "/logos/gemini.svg" },
  deepseek:   { name: "DeepSeek",     envKey: ["DEEPSEEK_API_KEY"],            baseUrlEnv: "DEEPSEEK_BASE_URL", defaultBase: "https://api.deepseek.com/v1", freeUrl: "https://platform.deepseek.com", logo: "/logos/deepseek.svg" },
  kimi:       { name: "Moonshot Kimi",envKey: ["KIMI_API_KEY","MOONSHOT_API_KEY"], baseUrlEnv: "KIMI_BASE_URL", defaultBase: "https://api.moonshot.ai/v1", freeUrl: "https://platform.moonshot.ai", logo: "/logos/kimi.svg" },
  openai:     { name: "OpenAI Astra", envKey: ["OPENAI_API_KEY"],              baseUrlEnv: "OPENAI_BASE_URL",   defaultBase: "https://api.openai.com/v1", freeUrl: "https://platform.openai.com", logo: "/logos/openai.png" },
  seedance:   { name: "ByteDance Seedance", envKey: ["SEEDANCE_API_KEY","ARK_API_KEY"], baseUrlEnv: "SEEDANCE_BASE_URL", defaultBase: "https://ark.cn-beijing.volces.com/api/v3", freeUrl: "https://www.volcengine.com", logo: "/logos/seedance.svg" },
  openrouter: { name: "OpenRouter",   envKey: ["OPENROUTER_API_KEY"],          baseUrlEnv: "OPENROUTER_BASE_URL", defaultBase: "https://openrouter.ai/api/v1", freeUrl: "https://openrouter.ai/keys", logo: "/logos/openrouter.svg" },
  groq:       { name: "Groq",         envKey: ["GROQ_API_KEY"],                baseUrlEnv: "GROQ_BASE_URL",     defaultBase: "https://api.groq.com/openai/v1", freeUrl: "https://console.groq.com/keys", logo: "/logos/groq.webp" },
  cloudflare: { name: "Cloudflare Workers AI", envKey: ["CLOUDFLARE_API_KEY","CF_API_TOKEN"], baseUrlEnv: "CLOUDFLARE_BASE_URL", defaultBase: "https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/v1", freeUrl: "https://dash.cloudflare.com/?to=/:account/ai", logo: "/logos/cloudflare.svg" },
  zai:        { name: "Z.ai (GLM)",   envKey: ["ZAI_API_KEY","ZHIPU_API_KEY"], baseUrlEnv: "ZAI_BASE_URL",      defaultBase: "https://api.z.ai/api/paas/v4", freeUrl: "https://z.ai/model-api", logo: "/logos/zai.svg" },
  nim:        { name: "NVIDIA NIM",   envKey: ["NVIDIA_API_KEY","NIM_API_KEY"], baseUrlEnv: "NIM_BASE_URL",     defaultBase: "https://integrate.api.nvidia.com/v1", freeUrl: "https://build.nvidia.com", logo: "/logos/nvidia.svg" },
};

// ===== Rantai fallback hasil riset (antar-provider, bukan satu provider) =====
export const CHAIN_CHAT = ["lytoos/gemini-3.8-flash","lytoos/or-inkling-free","lytoos/groq-gpt-oss-120b","lytoos/or-nemotron-ultra-free","lytoos/glm-4.7-flash","lytoos/or-free-router"];
export const CHAIN_CODE = ["lytoos/gemini-3.8-flash","lytoos/or-north-mini-code-free","lytoos/or-flint-free","lytoos/groq-qwen3-27b","lytoos/cf-qwen-coder"];
export const CHAIN_REASONING = ["lytoos/or-nemotron-ultra-free","lytoos/groq-gpt-oss-120b","lytoos/nim-kimi-k3","lytoos/gemini-3.8-flash","lytoos/cf-qwq-32b"];
export const CHAIN_VISION = ["lytoos/gemini-3.8-flash","lytoos/or-nemotron-vl-free","lytoos/or-gemma-4-31b-free","lytoos/glm-4.6v-flash","lytoos/nim-llama-vision","lytoos/cf-llama-vision"];
export const CHAIN_FAST = ["lytoos/gemini-3.5-flash-lite","lytoos/groq-gpt-oss-20b","lytoos/or-lfm-2.5-free","lytoos/cf-llama-3b","lytoos/glm-4.7-flash"];
export const CHAIN_IMAGE = ["lytoos/cf-flux-schnell"];

const P0 = { prompt: "0", completion: "0" };
type M = LytoosModel;
const base = (m: Partial<M> & Pick<M,"id"|"upstream"|"name"|"provider"|"providerName"|"description"|"capabilities"|"fallback">): M => ({
  contextLength: 128000, pricing: P0, free: true, status: "active", year: 2027, tags: [], ...m,
} as M);

export const MODELS_2027: LytoosModel[] = [
  // ===== Model virtual Lytoos (router) =====
  base({ id:"lytoos/auto", upstream:"gemini-3.8-flash", name:"Lytoos Auto — Chat Router", provider:"gemini", providerName:"Lytoos Router", description:"Rantai chat gratis terbaik hasil riset: Gemini 3.8 Flash → OpenRouter Inkling → Groq GPT-OSS-120B → Nemotron Ultra → GLM-4.7-Flash → OpenRouter Free. Rekomendasi default.", contextLength:1048576, capabilities:["chat","vision","code"], fallback:CHAIN_CHAT.slice(1), tags:["auto","recommended","virtual"] }),
  base({ id:"lytoos/code", upstream:"gemini-3.8-flash", name:"Lytoos Code", provider:"gemini", providerName:"Lytoos Router", description:"Rantai khusus coding: Gemini 3.8 Flash → North Mini Code → Flint → Qwen3 (Groq) → Qwen Coder (Cloudflare).", contextLength:1048576, capabilities:["code","chat"], fallback:CHAIN_CODE.slice(1), tags:["code","virtual"] }),
  base({ id:"lytoos/reasoning", upstream:"nvidia/nemotron-3-ultra-550b-a55b:free", name:"Lytoos Reasoning", provider:"openrouter", providerName:"Lytoos Router", description:"Rantai reasoning: Nemotron Ultra 550B → GPT-OSS-120B (Groq) → Kimi K3 (NVIDIA NIM) → Gemini 3.8 Flash → QwQ-32B (Cloudflare).", contextLength:1048576, capabilities:["reasoning","chat"], fallback:CHAIN_REASONING.slice(1), tags:["reasoning","virtual"] }),
  base({ id:"lytoos/vision", upstream:"gemini-3.8-flash", name:"Lytoos Vision", provider:"gemini", providerName:"Lytoos Router", description:"Rantai vision: Gemini 3.8 Flash → Nemotron VL → Gemma 4 31B → GLM-4.6V-Flash → Llama Vision (NIM) → Llama Vision (Cloudflare).", contextLength:1048576, capabilities:["vision","chat"], fallback:CHAIN_VISION.slice(1), tags:["vision","virtual"] }),
  base({ id:"lytoos/fast", upstream:"gemini-3.5-flash-lite", name:"Lytoos Fast", provider:"gemini", providerName:"Lytoos Router", description:"Rantai cepat/volume tinggi (klasifikasi, ekstraksi, widget chat): Gemini Flash-Lite → GPT-OSS-20B (Groq ~1.000 tok/s) → LFM-2.5 → Llama 3B (Cloudflare) → GLM-4.7-Flash.", contextLength:1048576, capabilities:["chat"], fallback:CHAIN_FAST.slice(1), tags:["fast","virtual"] }),
  base({ id:"lytoos/image", upstream:"@cf/black-forest-labs/flux-1-schnell", name:"Lytoos Image", provider:"cloudflare", providerName:"Lytoos Router", description:"Gambar gratis via Cloudflare FLUX.1 Schnell (10.000 Neurons/hari). Satu-satunya rute gambar gratis yang solid menurut riset.", contextLength:32000, capabilities:["image"], fallback:[], tags:["image","virtual"] }),
  base({ id:"lytoos/auto-free", upstream:"gemini-3.8-flash", name:"Lytoos Auto (Alias Lama)", provider:"gemini", providerName:"Lytoos Router", description:"Alias kompatibilitas untuk lytoos/auto versi v1.", contextLength:1048576, capabilities:["chat","code","vision"], fallback:CHAIN_CHAT.slice(1), tags:["alias"] }),

  // ===== Gemini (direct, AI Studio gratis) =====
  base({ id:"lytoos/gemini-3.8-flash", upstream:"gemini-3.8-flash", name:"Gemini 3.8 Flash", provider:"gemini", providerName:"Google Gemini", description:"Kualitas gratis terbaik menurut riset: multimodal penuh (teks/gambar/video/audio/PDF), konteks 1M, gratis via AI Studio tanpa kartu.", contextLength:1048576, capabilities:["chat","vision","code","reasoning"], fallback:CHAIN_CHAT.slice(1), tags:["google","1M-context","free"] }),
  base({ id:"lytoos/gemini-3.5-flash-lite", upstream:"gemini-3.5-flash-lite", name:"Gemini 3.5 Flash-Lite", provider:"gemini", providerName:"Google Gemini", description:"Varian paling ringan & cepat untuk volume tinggi, tetap gratis via AI Studio.", contextLength:1048576, capabilities:["chat","vision"], fallback:CHAIN_FAST.slice(1), tags:["google","fast","free"] }),
  base({ id:"lytoos/gemini-3-flash-free", upstream:"gemini-3.8-flash", name:"Gemini 3 Flash Free (Alias)", provider:"gemini", providerName:"Google Gemini", description:"Alias v1 — sekarang menunjuk ke Gemini 3.8 Flash hasil riset.", contextLength:1048576, capabilities:["chat","vision","code"], fallback:CHAIN_CHAT.slice(1), tags:["alias"] }),
  base({ id:"lytoos/gemini-flash", upstream:"gemini-3.8-flash", name:"Gemini Flash (Alias)", provider:"gemini", providerName:"Google Gemini", description:"Alias kompatibilitas gemini-flash → Gemini 3.8 Flash.", contextLength:1048576, capabilities:["chat","vision"], fallback:CHAIN_CHAT.slice(1), tags:["alias"] }),

  // ===== OpenRouter :free =====
  base({ id:"lytoos/or-inkling-free", upstream:"thinkingmachines/inkling:free", name:"Inkling (Thinking Machines) :free", provider:"openrouter", providerName:"OpenRouter", description:"Model gratis OpenRouter konteks 1M. Batas free: 20 RPM, 50 req/hari (1.000/hari bila pernah isi kredit ≥$10).", contextLength:1048576, capabilities:["chat","code"], fallback:CHAIN_CHAT.slice(2), tags:["openrouter","free","1M-context"] }),
  base({ id:"lytoos/or-nemotron-ultra-free", upstream:"nvidia/nemotron-3-ultra-550b-a55b:free", name:"Nemotron 3 Ultra 550B :free", provider:"openrouter", providerName:"OpenRouter", description:"Reasoning raksasa NVIDIA gratis di OpenRouter, konteks 1M.", contextLength:1048576, capabilities:["reasoning","chat"], fallback:CHAIN_REASONING.slice(1), tags:["openrouter","free","reasoning"] }),
  base({ id:"lytoos/or-north-mini-code-free", upstream:"cohere/north-mini-code:free", name:"North Mini Code (Cohere) :free", provider:"openrouter", providerName:"OpenRouter", description:"Model coding gratis Cohere di OpenRouter — pemimpin rantai coding pasca-Poolside.", contextLength:256000, capabilities:["code","chat"], fallback:CHAIN_CODE.slice(2), tags:["openrouter","free","code"] }),
  base({ id:"lytoos/or-flint-free", upstream:"recursive/flint-v1.0:free", name:"Flint v1.0 (Recursive) :free", provider:"openrouter", providerName:"OpenRouter", description:"Model agen coding gratis di OpenRouter.", contextLength:256000, capabilities:["code","chat"], fallback:CHAIN_CODE.slice(3), tags:["openrouter","free","code"] }),
  base({ id:"lytoos/or-nemotron-vl-free", upstream:"nvidia/nemotron-3.5-super-vl:free", name:"Nemotron 3.5 Super VL :free", provider:"openrouter", providerName:"OpenRouter", description:"Vision-language gratis (gambar+video), konteks 1M.", contextLength:1048576, capabilities:["vision","chat"], fallback:CHAIN_VISION.slice(2), tags:["openrouter","free","vision"] }),
  base({ id:"lytoos/or-gemma-4-31b-free", upstream:"google/gemma-4-31b-it:free", name:"Gemma 4 31B IT :free", provider:"openrouter", providerName:"OpenRouter", description:"Gemma 4 multimodal gratis di OpenRouter.", contextLength:256000, capabilities:["vision","chat"], fallback:CHAIN_VISION.slice(3), tags:["openrouter","free","vision"] }),
  base({ id:"lytoos/or-lfm-2.5-free", upstream:"liquid/lfm-2.5-2.6b:free", name:"LFM-2.5 2.6B (Liquid) :free", provider:"openrouter", providerName:"OpenRouter", description:"Model kecil super cepat untuk rantai fast.", contextLength:128000, capabilities:["chat"], fallback:CHAIN_FAST.slice(3), tags:["openrouter","free","fast"] }),
  base({ id:"lytoos/or-free-router", upstream:"openrouter/free", name:"OpenRouter Free Router", provider:"openrouter", providerName:"OpenRouter", description:"Router bawaan OpenRouter: otomatis memilih model :free yang tersedia. Jaring pengaman terakhir rantai chat.", contextLength:256000, capabilities:["chat"], fallback:[], tags:["openrouter","free","router"] }),

  // ===== Groq (free tier menyusut: GPT-OSS + Qwen) =====
  base({ id:"lytoos/groq-gpt-oss-120b", upstream:"openai/gpt-oss-120b", name:"GPT-OSS-120B (Groq)", provider:"groq", providerName:"Groq", description:"GPT-OSS-120B di hardware Groq: sangat cepat, anggaran ~200K token/hari di free tier.", contextLength:131072, capabilities:["chat","reasoning","code"], fallback:CHAIN_CHAT.slice(3), tags:["groq","free","fast"] }),
  base({ id:"lytoos/groq-gpt-oss-20b", upstream:"openai/gpt-oss-20b", name:"GPT-OSS-20B (Groq)", provider:"groq", providerName:"Groq", description:"GPT-OSS-20B di Groq, ~1.000 token/detik — tulang punggung rantai fast.", contextLength:131072, capabilities:["chat"], fallback:CHAIN_FAST.slice(2), tags:["groq","free","fast"] }),
  base({ id:"lytoos/groq-qwen3-27b", upstream:"qwen/qwen3.8-27b", name:"Qwen3 27B (Groq)", provider:"groq", providerName:"Groq", description:"Qwen3 di Groq: vision + code, 30 RPM / 1.000 req per hari di free tier.", contextLength:131072, capabilities:["code","vision","chat"], fallback:CHAIN_CODE.slice(4), tags:["groq","free","code"] }),

  // ===== Z.ai (GLM Flash benar-benar $0) =====
  base({ id:"lytoos/glm-4.7-flash", upstream:"glm-4.7-flash", name:"GLM-4.7-Flash (Z.ai)", provider:"zai", providerName:"Z.ai (GLM)", description:"Gratis $0 tanpa batas token (dibatasi konkurensi) — jaring pengaman rantai chat & fast.", contextLength:200000, capabilities:["chat","code"], fallback:[], tags:["zai","free","glm"] }),
  base({ id:"lytoos/glm-4.6v-flash", upstream:"glm-4.6v-flash", name:"GLM-4.6V-Flash (Z.ai)", provider:"zai", providerName:"Z.ai (GLM)", description:"Vision gratis $0 dari Z.ai.", contextLength:128000, capabilities:["vision","chat"], fallback:CHAIN_VISION.slice(4), tags:["zai","free","vision"] }),

  // ===== NVIDIA NIM (free endpoint prototyping) =====
  base({ id:"lytoos/nim-kimi-k3", upstream:"moonshotai/kimi-k3", name:"Kimi K3 (NVIDIA NIM)", provider:"nim", providerName:"NVIDIA NIM", description:"Cara gratis memakai Kimi generasi terbaru: lewat endpoint gratis NVIDIA NIM, konteks 1M. (API Kimi langsung TIDAK gratis.)", contextLength:1048576, capabilities:["reasoning","chat","code"], fallback:CHAIN_REASONING.slice(3), tags:["nim","free","kimi"] }),
  base({ id:"lytoos/nim-llama-vision", upstream:"meta/llama-3.2-90b-vision-instruct", name:"Llama 3.2 90B Vision (NVIDIA NIM)", provider:"nim", providerName:"NVIDIA NIM", description:"Vision besar Meta lewat endpoint gratis NVIDIA NIM.", contextLength:128000, capabilities:["vision","chat"], fallback:CHAIN_VISION.slice(5), tags:["nim","free","vision"] }),

  // ===== Cloudflare Workers AI (10.000 Neurons/hari) =====
  base({ id:"lytoos/cf-qwen-coder", upstream:"@cf/qwen/qwen2.5-coder-32b-instruct", name:"Qwen2.5 Coder 32B (Cloudflare)", provider:"cloudflare", providerName:"Cloudflare Workers AI", description:"Coder 32B di Workers AI, kuota harian 10.000 Neurons bersama.", contextLength:128000, capabilities:["code","chat"], fallback:[], tags:["cloudflare","free","code"] }),
  base({ id:"lytoos/cf-qwq-32b", upstream:"@cf/qwen/qwq-32b", name:"QwQ-32B (Cloudflare)", provider:"cloudflare", providerName:"Cloudflare Workers AI", description:"Reasoning QwQ-32B di Workers AI.", contextLength:128000, capabilities:["reasoning","chat"], fallback:[], tags:["cloudflare","free","reasoning"] }),
  base({ id:"lytoos/cf-llama-vision", upstream:"@cf/meta/llama-3.2-11b-vision-instruct", name:"Llama 3.2 11B Vision (Cloudflare)", provider:"cloudflare", providerName:"Cloudflare Workers AI", description:"Vision ringan di Workers AI.", contextLength:128000, capabilities:["vision","chat"], fallback:[], tags:["cloudflare","free","vision"] }),
  base({ id:"lytoos/cf-llama-3b", upstream:"@cf/meta/llama-3.2-3b-instruct", name:"Llama 3.2 3B (Cloudflare)", provider:"cloudflare", providerName:"Cloudflare Workers AI", description:"Model mungil untuk rantai fast di Workers AI.", contextLength:128000, capabilities:["chat"], fallback:CHAIN_FAST.slice(4), tags:["cloudflare","free","fast"] }),
  base({ id:"lytoos/cf-flux-schnell", upstream:"@cf/black-forest-labs/flux-1-schnell", name:"FLUX.1 Schnell (Cloudflare)", provider:"cloudflare", providerName:"Cloudflare Workers AI", description:"Generate gambar gratis FLUX.1 Schnell di Workers AI.", contextLength:32000, capabilities:["image"], fallback:[], tags:["cloudflare","free","image"] }),

  // ===== Entri lama v1: dipertahankan, status diperjelas =====
  base({ id:"lytoos/muse-spark-1.2-free", upstream:"muse-spark-1.2", name:"Muse Spark 1.2 Free", provider:"muse", providerName:"Meta Muse", description:"Entri katalog awal Lytoos (klaim 2027, belum terverifikasi riset) — diperlakukan sebagai trial/BYOK sampai ada endpoint resmi yang terkonfirmasi.", contextLength:262144, capabilities:["chat","vision","code"], status:"trial", fallback:CHAIN_CHAT, tags:["trial","unverified"] }),
  base({ id:"lytoos/muse-spark-1.2-pro", upstream:"muse-spark-1.2-pro", name:"Muse Spark 1.2 Pro", provider:"muse", providerName:"Meta Muse", description:"Versi pro Muse Spark (BYOK). Status trial — belum terverifikasi riset.", contextLength:524288, capabilities:["chat","reasoning","vision","code"], status:"trial", fallback:CHAIN_CHAT, tags:["trial","unverified"] }),
  base({ id:"lytoos/agnes-2.0-flash-free", upstream:"agnes-2.0-flash", name:"Agnes 2.0 Flash Free", provider:"agnes", providerName:"Agnes AI", description:"Entri katalog awal — status trial, belum terverifikasi riset.", contextLength:128000, capabilities:["chat","code"], status:"trial", fallback:CHAIN_CHAT, tags:["trial","unverified"] }),
  base({ id:"lytoos/agnes-2.0-pro-free", upstream:"agnes-2.0-pro", name:"Agnes 2.0 Pro Free", provider:"agnes", providerName:"Agnes AI", description:"Entri katalog awal — status trial, belum terverifikasi riset.", contextLength:256000, capabilities:["chat","reasoning","vision"], status:"trial", fallback:CHAIN_CHAT, tags:["trial","unverified"] }),
  base({ id:"lytoos/gemini-3-pro-free", upstream:"gemini-3.8-flash", name:"Gemini 3 Pro Free (Alias)", provider:"gemini", providerName:"Google Gemini", description:"Alias v1 — kini menunjuk ke Gemini 3.8 Flash.", contextLength:1048576, capabilities:["chat","reasoning","vision","code"], fallback:CHAIN_CHAT, tags:["alias"] }),
  base({ id:"lytoos/chatgpt-6-astra-free", upstream:"gpt-6-astra", name:"ChatGPT-6 Astra Free", provider:"openai", providerName:"OpenAI Astra", description:"Entri katalog awal (klaim 2027) — BYOK OpenAI, status trial, belum terverifikasi riset. Lytoos tidak menjual token.", contextLength:400000, capabilities:["chat","reasoning","vision","code"], status:"trial", fallback:CHAIN_CHAT, tags:["trial","unverified","byok"] }),
  base({ id:"lytoos/chatgpt-6-astra-mini", upstream:"gpt-6-astra-mini", name:"ChatGPT-6 Astra Mini", provider:"openai", providerName:"OpenAI Astra", description:"Versi mini Astra — status trial, belum terverifikasi riset.", contextLength:400000, capabilities:["chat","code"], status:"trial", fallback:CHAIN_CHAT, tags:["trial","unverified"] }),

  // ===== Mati menurut riset: dikeluarkan dari rantai gratis =====
  base({ id:"lytoos/deepseek-v4-free", upstream:"deepseek-chat", name:"DeepSeek V4 Free — NONAKTIF", provider:"deepseek", providerName:"DeepSeek", description:"NONAKTIF: riset membuktikan DeepSeek tidak punya free tier API langsung dan ID lama sudah pensiun. DeepSeek gratis hanya lewat NVIDIA NIM/OpenRouter.", contextLength:256000, capabilities:["chat","code","reasoning"], free:false, status:"dead", fallback:[], tags:["dead","avoid"] }),
  base({ id:"lytoos/deepseek-r2-free", upstream:"deepseek-reasoner", name:"DeepSeek R2 Reasoner — NONAKTIF", provider:"deepseek", providerName:"DeepSeek", description:"NONAKTIF: ID upstream lama pensiun; tidak ada jalur gratis langsung.", contextLength:256000, capabilities:["reasoning","code"], free:false, status:"dead", fallback:[], tags:["dead","avoid"] }),
  base({ id:"lytoos/kimi-k2.6-free", upstream:"kimi-k2.6", name:"Kimi K2.6 Free — NONAKTIF", provider:"kimi", providerName:"Moonshot Kimi", description:"NONAKTIF: API Kimi langsung tidak gratis. Gunakan lytoos/nim-kimi-k3 (Kimi via NVIDIA NIM) sebagai gantinya.", contextLength:262144, capabilities:["chat","code","reasoning"], free:false, status:"dead", fallback:[], tags:["dead","avoid"] }),
  base({ id:"lytoos/kimi-k2.6-thinking", upstream:"kimi-k2.6-thinking", name:"Kimi K2.6 Thinking — NONAKTIF", provider:"kimi", providerName:"Moonshot Kimi", description:"NONAKTIF: sama seperti Kimi langsung lainnya — tidak ada free tier API langsung.", contextLength:262144, capabilities:["reasoning","chat"], free:false, status:"dead", fallback:[], tags:["dead","avoid"] }),
  base({ id:"lytoos/seedance-2.5", upstream:"seedance-2-5", name:"Seedance 2.5 (Trial)", provider:"seedance", providerName:"ByteDance Seedance", description:"TRIAL SAJA: riset menyimpulkan tidak ada API video gratis yang berdiri tetap. Endpoint video bersifat eksperimental dan memerlukan key/kredit Ark sendiri.", contextLength:32000, capabilities:["video"], free:false, status:"trial", fallback:[], tags:["video","trial"] }),
  base({ id:"lytoos/seedance-2.5-fast", upstream:"seedance-2-5-fast", name:"Seedance 2.5 Fast (Trial)", provider:"seedance", providerName:"ByteDance Seedance", description:"TRIAL SAJA: lihat catatan Seedance 2.5 — tidak ada video gratis tetap.", contextLength:32000, capabilities:["video"], free:false, status:"trial", fallback:[], tags:["video","trial"] }),
];

export function findModel(id?: string): LytoosModel {
  if (!id || id === "auto" || id === "lytoos/auto" || id === "lytoos/auto-free") return MODELS_2027.find(m=>m.id==="lytoos/auto")!;
  return MODELS_2027.find(m=>m.id===id) || MODELS_2027.find(m=>m.id.includes(id)) || MODELS_2027.find(m=>m.id==="lytoos/gemini-3.8-flash")!;
}
export function searchModels(q="", provider="", cap="") {
  const s=q.trim().toLowerCase();
  return MODELS_2027.filter(m=>{
    const hit=!s || [m.id,m.name,m.providerName,m.description,m.tags.join(" ")].join(" ").toLowerCase().includes(s);
    return hit && (!provider || m.provider===provider) && (!cap || m.capabilities.includes(cap as Capability));
  });
}
