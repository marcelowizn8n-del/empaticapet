"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import type { ShiftReport } from "@/lib/internacoes";
import { formatDateTime } from "@/lib/internacoes";
import {
  Sparkles,
  AlertTriangle,
  Pill,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Mic,
  FileText,
  Activity,
  Utensils,
} from "lucide-react";

export default function ShiftReportCard({ report }: { report: ShiftReport }) {
  const supabase = createClient();
  const [expanded, setExpanded] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const summary = report.ai_summary;

  const toggle = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && report.audio_url && !audioUrl) {
      setLoadingAudio(true);
      const { data } = await supabase.storage
        .from("plantao-audios")
        .createSignedUrl(report.audio_url, 3600);
      setAudioUrl(data?.signedUrl ?? null);
      setLoadingAudio(false);
    }
  };

  return (
    <Card>
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
              {report.shift_label || "Plantão"}
            </span>
            {report.audio_url && (
              <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <Mic size={11} /> Áudio
              </span>
            )}
          </div>
          <p className="text-xs text-on-surface-variant mt-1.5">
            {report.author_name || "Profissional"} •{" "}
            {formatDateTime(report.created_at)}
          </p>
        </div>
      </div>

      {/* Resumo da IA */}
      {summary ? (
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Resumo da IA
            </span>
          </div>

          <p className="text-sm font-semibold text-on-surface">
            {summary.estado_geral}
          </p>
          <p className="text-sm text-on-surface-variant">{summary.resumo}</p>

          {summary.alertas.length > 0 && (
            <SummaryList
              icon={<AlertTriangle size={14} className="text-error" />}
              title="Alertas"
              items={summary.alertas}
              accent="text-error"
            />
          )}
          {summary.pontos_criticos.length > 0 && (
            <SummaryList
              icon={<Activity size={14} className="text-amber-dark" />}
              title="Pontos críticos"
              items={summary.pontos_criticos}
              accent="text-amber-dark"
            />
          )}
          {summary.medicacoes.length > 0 && (
            <SummaryList
              icon={<Pill size={14} className="text-secondary" />}
              title="Medicações"
              items={summary.medicacoes}
              accent="text-secondary"
            />
          )}
          {summary.alimentacao_eliminacoes &&
            summary.alimentacao_eliminacoes !== "sem informação" && (
              <div className="flex items-start gap-2">
                <Utensils size={14} className="text-on-surface-variant mt-0.5 shrink-0" />
                <p className="text-xs text-on-surface-variant">
                  <span className="font-semibold">
                    Alimentação / eliminações:{" "}
                  </span>
                  {summary.alimentacao_eliminacoes}
                </p>
              </div>
            )}
          {summary.pendencias.length > 0 && (
            <SummaryList
              icon={<ClipboardList size={14} className="text-primary" />}
              title="Pendências para o próximo plantão"
              items={summary.pendencias}
              accent="text-primary"
            />
          )}
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant italic">
          Resumo da IA indisponível para este relatório.
        </p>
      )}

      {/* Conteúdo bruto (expansível) */}
      {(report.written_report || report.transcription || report.audio_url) && (
        <>
          <button
            onClick={toggle}
            className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded
              ? "Ocultar relatório completo"
              : "Ver relatório completo (texto e áudio)"}
          </button>

          {expanded && (
            <div className="mt-3 space-y-4 border-t border-outline-variant/20 pt-4">
              {report.written_report && (
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <FileText size={13} /> Relatório escrito
                  </p>
                  <p className="text-sm text-on-surface-variant whitespace-pre-wrap">
                    {report.written_report}
                  </p>
                </div>
              )}
              {report.transcription && (
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Mic size={13} /> Transcrição do áudio
                  </p>
                  <p className="text-sm text-on-surface-variant whitespace-pre-wrap">
                    {report.transcription}
                  </p>
                </div>
              )}
              {report.audio_url && (
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Mic size={13} /> Áudio original
                  </p>
                  {loadingAudio ? (
                    <p className="text-xs text-on-surface-variant">
                      Carregando áudio...
                    </p>
                  ) : audioUrl ? (
                    <audio controls src={audioUrl} className="w-full h-10" />
                  ) : (
                    <p className="text-xs text-on-surface-variant">
                      Não foi possível carregar o áudio.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function SummaryList({
  icon,
  title,
  items,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className={`text-xs font-semibold ${accent}`}>{title}</p>
        <ul className="mt-0.5 space-y-0.5">
          {items.map((item, i) => (
            <li key={i} className="text-xs text-on-surface-variant">
              • {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
