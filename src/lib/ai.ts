// Integrações de IA para o Relatório de Internação / Passagem de Plantão.
// Transcrição de áudio: OpenAI. Resumo estruturado: Anthropic (Claude).
// Tudo configurável por variável de ambiente — basta trocar o .env para mudar de provedor/modelo.

const OPENAI_TRANSCRIBE_MODEL =
  process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe";
const ANTHROPIC_SUMMARY_MODEL =
  process.env.ANTHROPIC_SUMMARY_MODEL || "claude-haiku-4-5";

export type ShiftSummary = {
  estado_geral: string;
  resumo: string;
  pontos_criticos: string[];
  medicacoes: string[];
  alimentacao_eliminacoes: string;
  pendencias: string[];
  alertas: string[];
};

// Transcreve um arquivo de áudio para texto via OpenAI.
export async function transcribeAudio(file: File): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY não configurada. Adicione a chave no arquivo .env.local."
    );
  }

  const form = new FormData();
  form.append("file", file);
  form.append("model", OPENAI_TRANSCRIBE_MODEL);
  form.append("language", "pt");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Falha na transcrição (OpenAI): ${detail}`);
  }

  const data = (await res.json()) as { text?: string };
  return (data.text || "").trim();
}

// Gera um resumo estruturado da passagem de plantão via Claude.
export async function summarizeShiftReport(input: {
  petName: string;
  species: string;
  reason: string;
  reportText: string;
}): Promise<ShiftSummary> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY não configurada. Adicione a chave no arquivo .env.local."
    );
  }

  const prompt = `Você é um assistente clínico veterinário. Recebe a passagem de plantão de um(a) profissional sobre um animal internado e deve produzir um RESUMO OBJETIVO para o próximo plantonista ler em segundos, sem precisar ouvir o áudio nem ler todo o relatório.

DADOS DO PACIENTE
- Nome: ${input.petName}
- Espécie: ${input.species}
- Motivo da internação: ${input.reason}

RELATÓRIO DO PLANTÃO (texto digitado e/ou transcrição do áudio)
"""
${input.reportText}
"""

Responda APENAS com um objeto JSON válido, sem markdown, sem texto antes ou depois, exatamente neste formato:
{
  "estado_geral": "uma frase curta: estável / em observação / crítico e por quê",
  "resumo": "2 a 4 frases com o essencial do plantão",
  "pontos_criticos": ["fatos clínicos que exigem atenção imediata"],
  "medicacoes": ["medicação, dose, via e horário relevantes mencionados"],
  "alimentacao_eliminacoes": "alimentação, hidratação, urina/fezes em uma frase (ou 'sem informação')",
  "pendencias": ["tarefas que o próximo plantão precisa executar"],
  "alertas": ["riscos, alergias ou sinais de alarme a vigiar"]
}

Regras:
- Use português do Brasil, linguagem clínica e concisa.
- Não invente informação que não esteja no relatório. Se algo não foi mencionado, use lista vazia [] ou "sem informação".
- Arrays podem ter de 0 a 6 itens, cada item curto e direto.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_SUMMARY_MODEL,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Falha no resumo (Claude): ${detail}`);
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const raw = data.content?.find((c) => c.type === "text")?.text || "";

  // Claude pode ocasionalmente envolver o JSON — extrai o objeto.
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Resposta da IA não continha JSON válido.");
  }

  const parsed = JSON.parse(raw.slice(start, end + 1)) as Partial<ShiftSummary>;

  return {
    estado_geral: parsed.estado_geral || "sem informação",
    resumo: parsed.resumo || "",
    pontos_criticos: parsed.pontos_criticos || [],
    medicacoes: parsed.medicacoes || [],
    alimentacao_eliminacoes: parsed.alimentacao_eliminacoes || "sem informação",
    pendencias: parsed.pendencias || [],
    alertas: parsed.alertas || [],
  };
}
