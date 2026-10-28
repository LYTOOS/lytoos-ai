import { NextResponse } from "next/server";
import { MODELS_2027 } from "@/lib/models";
// OpenRouter-compatible: GET /v1/models
export async function GET(){
  return NextResponse.json({
    object:"list",
    data: MODELS_2027.map(m=>({
      id:m.id, object:"model", created:1893456000, owned_by:m.provider,
      name:m.name, description:m.description, context_length:m.contextLength,
      architecture:{ modality: m.capabilities.includes("video")?"text->video": m.capabilities.includes("vision")?"text+image->text":"text->text", input_modalities:["text"], output_modalities:["text"] },
      pricing:m.pricing, top_provider:{ context_length:m.contextLength, is_moderated:false },
      per_request_limits:null, lytoos:{ provider:m.providerName, free:m.free, capabilities:m.capabilities, fallback:m.fallback, year:2027 }
    }))
  }, { headers:{ "Access-Control-Allow-Origin":"*" } });
}
export async function OPTIONS(){ return new NextResponse(null,{headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Authorization, Content-Type"}}); }
