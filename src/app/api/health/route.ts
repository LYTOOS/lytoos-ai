import { NextResponse } from "next/server";
import { MODELS_2027 } from "@/lib/models";
export async function GET(){ return NextResponse.json({ status:"ok", service:"Lytoos AI", version:"1.0.0", models:MODELS_2027.length, time:new Date().toISOString() }); }
