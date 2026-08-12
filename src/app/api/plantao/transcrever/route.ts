import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/ai";
import { requireVet } from "../_auth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const authError = await requireVet();
  if (authError) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const value = formData.get("audio");
    if (value instanceof File) file = value;
  } catch {
    return NextResponse.json(
      { error: "Requisição inválida — envie o áudio em multipart/form-data." },
      { status: 400 }
    );
  }

  if (!file || file.size === 0) {
    return NextResponse.json(
      { error: "Nenhum áudio recebido." },
      { status: 400 }
    );
  }

  try {
    const transcription = await transcribeAudio(file);
    return NextResponse.json({ transcription });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao transcrever.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
