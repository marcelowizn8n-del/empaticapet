import { NextResponse } from "next/server";
import { summarizeShiftReport } from "@/lib/ai";
import { requireVet } from "../_auth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const authError = await requireVet();
  if (authError) {
    return NextResponse.json({ error: authError }, { status: 403 });
  }

  let body: {
    petName?: string;
    species?: string;
    reason?: string;
    reportText?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const reportText = (body.reportText || "").trim();
  if (reportText.length < 10) {
    return NextResponse.json(
      { error: "Relatório muito curto para resumir." },
      { status: 400 }
    );
  }

  try {
    const summary = await summarizeShiftReport({
      petName: body.petName || "Paciente",
      species: body.species || "outro",
      reason: body.reason || "não informado",
      reportText,
    });
    return NextResponse.json({ summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao resumir.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
