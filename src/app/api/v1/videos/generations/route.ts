import { NextRequest, NextResponse } from "next/server";
import { findModel } from "@/lib/models";
import { getProviderKey, getBaseUrl } from "@/lib/providers";
import { validateLytoosKey } from "@/lib/keys";
export const runtime="nodejs"; export const maxDuration=60;
// Seedance 2.5: POST /v1/videos/generations { model:"lytoos/seedance-2.5", prompt:"...", duration:5, ratio:"16:9" }
export async function POST(req:NextRequest){
  const auth=await validateLytoosKey(req.headers.get("authorization"));
  if(!auth.ok) return NextResponse.json({error:{message:"Invalid Lytoos API key"}},{status:401});
  const body=await req.json().catch(()=>({}));
  if(!body.prompt) return NextResponse.json({error:{message:"prompt is required"}},{status:400});
  const model=findModel(body.model||"lytoos/seedance-2.5");
  const key=getProviderKey(model);
  if(!key){
    if(process.env.LYTOOS_DEMO_MODE==="1") return NextResponse.json({ id:"vid-demo-"+Date.now(), status:"queued", model:model.id, demo:true, message:"Demo mode: tambahkan SEEDANCE_API_KEY / ARK_API_KEY (BYOK) untuk render video asli Seedance 2.5.", prompt:body.prompt });
    return NextResponse.json({error:{message:"No Seedance key. Add SEEDANCE_API_KEY in /keys"}},{status:401});
  }
  const res=await fetch(`${getBaseUrl(model)}/contents/generations/tasks`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${key}`},body:JSON.stringify({model:model.upstream,content:[{type:"text",text:body.prompt}],duration:body.duration||5,ratio:body.ratio||"16:9"})});
  const data=await res.json().catch(()=>({}));
  return NextResponse.json({ id:data.id||data.task_id, status:res.ok?"queued":"failed", model:model.id, upstream:data },{status:res.ok?200:res.status});
}
