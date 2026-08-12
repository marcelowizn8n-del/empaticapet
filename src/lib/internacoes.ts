import type { ShiftSummary } from "./ai";

export type InternacaoStatus = "internado" | "observacao" | "critico" | "alta";
export type Species = "cão" | "gato" | "outro";

export type Internacao = {
  id: string;
  pet_name: string;
  species: Species;
  breed: string | null;
  tutor_name: string | null;
  box: string | null;
  reason: string;
  status: InternacaoStatus;
  admitted_at: string;
  discharged_at: string | null;
  created_by: string | null;
  created_at: string;
};

export type ShiftReport = {
  id: string;
  internacao_id: string;
  author_id: string | null;
  author_name: string | null;
  shift_label: string | null;
  written_report: string | null;
  audio_url: string | null;
  transcription: string | null;
  ai_summary: ShiftSummary | null;
  created_at: string;
};

export const STATUS_META: Record<
  InternacaoStatus,
  { label: string; className: string }
> = {
  internado: { label: "Internado", className: "bg-sky-light text-sky-dark" },
  observacao: {
    label: "Em observação",
    className: "bg-amber-light text-amber-dark",
  },
  critico: { label: "Crítico", className: "bg-error-container text-error" },
  alta: { label: "Alta", className: "bg-success/10 text-success" },
};

export const SPECIES_EMOJI: Record<Species, string> = {
  cão: "🐕",
  gato: "🐈",
  outro: "🐾",
};

export function speciesEmoji(species: string): string {
  return SPECIES_EMOJI[species as Species] ?? "🐾";
}

export type ICUMessageType = "text" | "audio" | "system";

export type ICUMessage = {
  id: string;
  internacao_id: string;
  author_id: string | null;
  author_name: string;
  message_type: ICUMessageType;
  content: string | null;
  audio_url: string | null;
  transcription: string | null;
  created_at: string;
};

export type ICUShiftSummary = {
  id: string;
  internacao_id: string;
  generated_by: string | null;
  shift_label: string;
  summary_data: ShiftSummary;
  messages_count: number;
  created_at: string;
};

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeOnly(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

