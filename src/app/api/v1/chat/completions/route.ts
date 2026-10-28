import { NextRequest, NextResponse } from "next/server";
import { chatWithFallback } from "@/lib/fallback";
import { validateLytoosKey, logUsage } from "@/lib/keys";

export const runtime = "nodejs"; export const maxDuration = 60;

// OpenRouter / OpenAI compatible: POST /v1/chat/completions
// Header opsional BYOK: X-Lytoos-Provider-Keys: {"GEMINI_API_KEY":"...","DEEPSEEK_API_KEY":"..."}
// Query opsional: ?fallback=true (default) / false
export async function POST(req: NextRequest){
  const auth = await validateLytoosKey(req.headers.get("authorization"));
  if (!auth.ok) return NextResponse.json({ error:{ message:"Invalid Lytoos API key. Buat key gratis di /keys", type:"auth", code:401 } }, { status:401 });

  let body:any; try { body = await req.json(); } catch { return NextResponse.json({error:{message:"Invalid JSON"}},{status:400}); }
  if (!body.messages?.length) return NextResponse.json({error:{message:"messages is required"}},{status:400});
  const requested = body.model || "lytoos/auto-free";

  let userKeys: Record<string,string>|undefined;
  try { const h=req.headers.get("x-lytoos-provider-keys"); if(h) userKeys=JSON.parse(h); } catch {}

  const started = Date.now();
  try {
    const r = await chatWithFallback(requested, body, userKeys);
    await logUsage({ api_key_id: auth.keyId==="demo"?null:auth.keyId, model_requested: requested, model_used: r.modelUsed, provider: r.provider, status:200, latency_ms: Date.now()-started, fallback_chain: r.fallbackChain });
    const payload = {
      id:"chatcmpl-lytoos-"+Date.now(), object:"chat.completion", created:Math.floor(Date.now()/1000),
      model:r.modelUsed, provider:r.provider,
      choices:[{ index:0, message:{ role:"assistant", content:r.content }, finish_reason:"stop" }],
      usage:{ prompt_tokens:0, completion_tokens:r.content.length/4|0, total_tokens:r.content.length/4|0 },
      lytoos:{ requested, fallback_chain:r.fallbackChain, auto_fallback: r.modelUsed!==requested }
    };
    if (body.stream) {
      const enc = new TextEncoder();
      const stream = new ReadableStream({ start(c){
        c.enqueue(enc.encode(`data: ${JSON.stringify({id:payload.id,object:"chat.completion.chunk",created:payload.created,model:r.modelUsed,choices:[{index:0,delta:{content:r.content},finish_reason:null}]})}\n\n`));
        c.enqueue(enc.encode("data: [DONE]\n\n")); c.close();
      }});
      return new NextResponse(stream,{headers:{"Content-Type":"text/event-stream","X-Lytoos-Model":r.modelUsed,"X-Lytoos-Fallback-Chain":r.fallbackChain.join(",")}});
    }
    return NextResponse.json(payload,{headers:{"X-Lytoos-Model":r.modelUsed,"X-Lytoos-Fallback-Chain":r.fallbackChain.join(",")||"none","Access-Control-Allow-Origin":"*"}});
  } catch(e:any) {
    await logUsage({ model_requested:requested, status:e.status||503, latency_ms:Date.now()-started, fallback_chain:e.chain||[] });
    return NextResponse.json({ error:{ message:e.message, type:"gateway", code:e.status||503, fallback_chain:e.chain||[] } }, { status:e.status||503 });
  }
}
export async function OPTIONS(){ return new NextResponse(null,{headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Authorization, Content-Type, X-Lytoos-Provider-Keys"}}); }
