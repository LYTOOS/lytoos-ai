export type ProviderId = "muse" | "agnes" | "gemini" | "deepseek" | "kimi" | "openai" | "seedance";
export type Capability = "chat" | "reasoning" | "code" | "vision" | "video" | "image";

export interface LytoosModel {
  id: string;               // lytoos/muse-spark-1.2-free
  upstream: string;         // upstream model id
  name: string;
  provider: ProviderId;
  providerName: string;
  description: string;
  contextLength: number;
  capabilities: Capability[];
  pricing: { prompt: string; completion: string }; // "0" = gratis
  free: boolean;
  year: 2027;
  fallback: string[];       // ordered fallback model ids saat rate-limit
  tags: string[];
}

export const PROVIDERS: Record<ProviderId, { name: string; envKey: string[]; baseUrlEnv: string; defaultBase: string; freeUrl: string }> = {
  muse:     { name: "Meta Muse",    envKey: ["MUSE_API_KEY","META_API_KEY"], baseUrlEnv: "MUSE_BASE_URL",     defaultBase: "https://api.meta.ai/v1", freeUrl: "https://www.meta.ai" },
  agnes:    { name: "Agnes AI",     envKey: ["AGNES_API_KEY"],               baseUrlEnv: "AGNES_BASE_URL",    defaultBase: "https://api.agnes-ai.com/v1", freeUrl: "https://agnes.ai" },
  gemini:   { name: "Google Gemini",envKey: ["GEMINI_API_KEY","GOOGLE_API_KEY"], baseUrlEnv: "GEMINI_BASE_URL", defaultBase: "https://generativelanguage.googleapis.com/v1beta/openai", freeUrl: "https://aistudio.google.com/apikey" },
  deepseek: { name: "DeepSeek",     envKey: ["DEEPSEEK_API_KEY"],            baseUrlEnv: "DEEPSEEK_BASE_URL", defaultBase: "https://api.deepseek.com/v1", freeUrl: "https://platform.deepseek.com" },
  kimi:     { name: "Moonshot Kimi",envKey: ["KIMI_API_KEY","MOONSHOT_API_KEY"], baseUrlEnv: "KIMI_BASE_URL", defaultBase: "https://api.moonshot.ai/v1", freeUrl: "https://platform.moonshot.ai" },
  openai:   { name: "OpenAI Astra", envKey: ["OPENAI_API_KEY"],              baseUrlEnv: "OPENAI_BASE_URL",   defaultBase: "https://api.openai.com/v1", freeUrl: "https://platform.openai.com" },
  seedance: { name: "ByteDance Seedance", envKey: ["SEEDANCE_API_KEY","ARK_API_KEY"], baseUrlEnv: "SEEDANCE_BASE_URL", defaultBase: "https://ark.cn-beijing.volces.com/api/v3", freeUrl: "https://www.volcengine.com" },
};

const F_CHAT = ["lytoos/gemini-3-flash-free","lytoos/deepseek-v4-free","lytoos/kimi-k2.6-free","lytoos/agnes-2.0-flash-free"];

export const MODELS_2027: LytoosModel[] = [
  { id:"lytoos/muse-spark-1.2-free", upstream:"muse-spark-1.2", name:"Muse Spark 1.2 Free", provider:"muse", providerName:"Meta Muse", description:"Model flagship Meta 2027 versi gratis di Lytoos. Cepat, multimodal, unggul untuk chat & agent.", contextLength:262144, capabilities:["chat","vision","code"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["flagship","free","multimodal"] },
  { id:"lytoos/muse-spark-1.2-pro", upstream:"muse-spark-1.2-pro", name:"Muse Spark 1.2 Pro", provider:"muse", providerName:"Meta Muse", description:"Versi pro Muse Spark 1.2 dengan reasoning lebih dalam (BYOK).", contextLength:524288, capabilities:["chat","reasoning","vision","code"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["pro","reasoning"] },
  { id:"lytoos/agnes-2.0-flash-free", upstream:"agnes-2.0-flash", name:"Agnes 2.0 Flash Free", provider:"agnes", providerName:"Agnes AI", description:"Model Agnes super cepat & gratis, cocok untuk chat volume tinggi dan fallback pertama.", contextLength:128000, capabilities:["chat","code"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["fast","free"] },
  { id:"lytoos/agnes-2.0-pro-free", upstream:"agnes-2.0-pro", name:"Agnes 2.0 Pro Free", provider:"agnes", providerName:"Agnes AI", description:"Agnes Pro untuk tugas kompleks, tetap free-tier via BYOK Agnes.", contextLength:256000, capabilities:["chat","reasoning","vision"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["free","pro"] },
  { id:"lytoos/gemini-3-flash-free", upstream:"gemini-3.0-flash", name:"Gemini 3 Flash Free", provider:"gemini", providerName:"Google Gemini", description:"Gemini Flash generasi 2027. Gratis via Google AI Studio, konteks 1 juta token, vision bawaan.", contextLength:1048576, capabilities:["chat","vision","code"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["google","1M-context","free"] },
  { id:"lytoos/gemini-3-pro-free", upstream:"gemini-3.0-pro", name:"Gemini 3 Pro Free", provider:"gemini", providerName:"Google Gemini", description:"Gemini Pro 2027 untuk reasoning & multimodal berat, free-tier AI Studio.", contextLength:1048576, capabilities:["chat","reasoning","vision","code"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["google","reasoning"] },
  // Alias sesuai request user: gemini-flash
  { id:"lytoos/gemini-flash", upstream:"gemini-3.0-flash", name:"Gemini Flash (Alias)", provider:"gemini", providerName:"Google Gemini", description:"Alias kompatibilitas untuk gemini-flash -> Gemini 3 Flash.", contextLength:1048576, capabilities:["chat","vision"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["alias"] },
  { id:"lytoos/deepseek-v4-free", upstream:"deepseek-chat", name:"DeepSeek V4 Free", provider:"deepseek", providerName:"DeepSeek", description:"DeepSeek V4 chat, sangat kuat untuk coding & matematika, harga free-tier/trial.", contextLength:256000, capabilities:["chat","code","reasoning"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["code","math"] },
  { id:"lytoos/deepseek-r2-free", upstream:"deepseek-reasoner", name:"DeepSeek R2 Reasoner Free", provider:"deepseek", providerName:"DeepSeek", description:"Model reasoning DeepSeek R2 (penerus R1) dengan chain-of-thought panjang.", contextLength:256000, capabilities:["reasoning","code"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:["lytoos/kimi-k2.6-free","lytoos/gemini-3-pro-free"], tags:["reasoning"] },
  { id:"lytoos/kimi-k2.6-free", upstream:"kimi-k2.6", name:"Kimi K2.6 Free", provider:"kimi", providerName:"Moonshot Kimi", description:"Kimi K2.6 dari Moonshot AI. Unggul bahasa Indonesia/Mandarin/Inggris, konteks panjang, agent & coding.", contextLength:262144, capabilities:["chat","code","reasoning"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["long-context","agent"] },
  { id:"lytoos/kimi-k2.6-thinking", upstream:"kimi-k2.6-thinking", name:"Kimi K2.6 Thinking", provider:"kimi", providerName:"Moonshot Kimi", description:"Mode thinking Kimi K2.6 untuk soal sulit & perencanaan multi-step.", contextLength:262144, capabilities:["reasoning","chat"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:["lytoos/deepseek-r2-free","lytoos/gemini-3-pro-free"], tags:["thinking"] },
  { id:"lytoos/chatgpt-6-astra-free", upstream:"gpt-6-astra", name:"ChatGPT-6 Astra Free", provider:"openai", providerName:"OpenAI Astra", description:"GPT-6 Astra (2027) via BYOK OpenAI. Gateway Lytoos tidak menjual token - pakai key kamu sendiri.", contextLength:400000, capabilities:["chat","reasoning","vision","code"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["gpt-6","astra","byok"] },
  { id:"lytoos/chatgpt-6-astra-mini", upstream:"gpt-6-astra-mini", name:"ChatGPT-6 Astra Mini", provider:"openai", providerName:"OpenAI Astra", description:"Versi mini Astra: lebih cepat & hemat kuota BYOK, cocok fallback & chat umum.", contextLength:400000, capabilities:["chat","code"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["mini","fast"] },
  { id:"lytoos/seedance-2.5", upstream:"seedance-2-5", name:"Seedance 2.5", provider:"seedance", providerName:"ByteDance Seedance", description:"Model video generation Seedance 2.5 (2027). Text-to-video & image-to-video via endpoint /v1/videos/generations.", contextLength:32000, capabilities:["video"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:[], tags:["video","text-to-video"] },
  { id:"lytoos/seedance-2.5-fast", upstream:"seedance-2-5-fast", name:"Seedance 2.5 Fast", provider:"seedance", providerName:"ByteDance Seedance", description:"Seedance 2.5 Fast untuk preview video cepat 480p-720p.", contextLength:32000, capabilities:["video"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:["lytoos/seedance-2.5"], tags:["video","fast"] },
  { id:"lytoos/auto-free", upstream:"auto", name:"Lytoos Auto (Free Router)", provider:"gemini", providerName:"Lytoos Router", description:"Router pintar: otomatis pilih model gratis tercepat yang tidak rate-limit saat ini. Rekomendasi default.", contextLength:1048576, capabilities:["chat","code","vision"], pricing:{prompt:"0",completion:"0"}, free:true, year:2027, fallback:F_CHAT, tags:["auto","recommended"] },
];

export function findModel(id?: string): LytoosModel {
  if (!id || id === "lytoos/auto-free" || id === "auto") return MODELS_2027.find(m=>m.id==="lytoos/gemini-3-flash-free")!;
  return MODELS_2027.find(m=>m.id===id) || MODELS_2027.find(m=>m.id.includes(id)) || MODELS_2027[0];
}
export function searchModels(q="", provider="", cap="") {
  const s=q.trim().toLowerCase();
  return MODELS_2027.filter(m=>{
    const hit=!s || [m.id,m.name,m.providerName,m.description,m.tags.join(" ")].join(" ").toLowerCase().includes(s);
    return hit && (!provider || m.provider===provider) && (!cap || m.capabilities.includes(cap as Capability));
  });
}
