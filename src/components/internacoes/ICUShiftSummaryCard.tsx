"use client";

import type { ICUShiftSummary } from "@/lib/internacoes";
import { formatDateTime } from "@/lib/internacoes";
import {
  Sparkles,
  AlertTriangle,
  Pill,
  CheckSquare,
  Activity,
  Utensils,
  Clock,
  Loader2,
} from "lucide-react";

type Props = {
  summary: ICUShiftSummary | null;
  onSynthesize: () => void;
  synthesizing: boolean;
};

export default function ICUShiftSummaryCard({
  summary,
  onSynthesize,
  synthesizing,
}: Props) {
  const data = summary?.summary_data;

  return (
    <div className="bg-gradient-to-br from-primary/10 via-surface-container-lowest to-surface-container-low border border-primary/20 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header com Ação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-primary/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary/15 rounded-xl flex items-center justify-center text-primary shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-headline font-bold text-base text-on-surface">
              Resumo da Passagem de Plantão
            </h3>
            <p className="text-xs text-on-surface-variant">
              {summary
                ? `Sintetizado em ${formatDateTime(summary.created_at)} · ${summary.messages_count} mensagem(ns)`
                : "Nenhum resumo gerado para este turno ainda."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSynthesize}
          disabled={synthesizing}
          className="bg-primary-gradient text-on-primary text-xs font-semibold px-4 py-2.5 rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 shadow-sm"
        >
          {synthesizing ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Sparkles size={15} />
          )}
          {synthesizing ? "Sintetizando com IA..." : "Sintetizar Passagem de Plantão"}
        </button>
      </div>

      {/* Conteúdo do Resumo */}
      {data ? (
        <div className="space-y-3">
          {/* Estado Geral */}
          <div className="bg-surface-container-lowest rounded-xl p-3.5 border border-outline-variant/15 flex items-start gap-3">
            <Activity size={18} className="text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                Estado Geral
              </span>
              <p className="text-sm font-semibold text-on-surface mt-0.5">
                {data.estado_geral}
              </p>
              {data.resumo && (
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {data.resumo}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Pontos Críticos & Alertas */}
            {(data.pontos_criticos?.length > 0 || data.alertas?.length > 0) && (
              <div className="bg-error-container/20 rounded-xl p-3.5 border border-error/20 space-y-2">
                <span className="text-[11px] font-bold text-error uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Pontos Críticos & Alertas
                </span>
                <ul className="text-xs text-on-surface space-y-1 pl-4 list-disc marker:text-error">
                  {data.pontos_criticos?.map((item, idx) => (
                    <li key={`crit-${idx}`} className="font-semibold text-error">
                      {item}
                    </li>
                  ))}
                  {data.alertas?.map((item, idx) => (
                    <li key={`alert-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Medicações */}
            {data.medicacoes?.length > 0 && (
              <div className="bg-surface-container-lowest rounded-xl p-3.5 border border-outline-variant/15 space-y-2">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Pill size={14} /> Medicações Administradas / Prescritas
                </span>
                <ul className="text-xs text-on-surface space-y-1 pl-4 list-disc marker:text-primary">
                  {data.medicacoes.map((med, idx) => (
                    <li key={idx}>{med}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Alimentação e Eliminações */}
            {data.alimentacao_eliminacoes && (
              <div className="bg-surface-container-lowest rounded-xl p-3.5 border border-outline-variant/15 space-y-1">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils size={14} /> Alimentação & Eliminações
                </span>
                <p className="text-xs text-on-surface-variant">
                  {data.alimentacao_eliminacoes}
                </p>
              </div>
            )}

            {/* Pendências do Próximo Turno */}
            {data.pendencias?.length > 0 && (
              <div className="bg-amber-light/30 rounded-xl p-3.5 border border-amber/20 space-y-2">
                <span className="text-[11px] font-bold text-amber-dark uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare size={14} /> Pendências para o Próximo Plantão
                </span>
                <ul className="text-xs text-on-surface space-y-1 pl-4 list-disc marker:text-amber-dark">
                  {data.pendencias.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-on-surface-variant flex items-center justify-center gap-2">
          <Clock size={16} className="text-primary opacity-60" />
          A equipe enviará atualizações no chat durante o plantão. Clique em "Sintetizar Passagem de Plantão" para gerar o resumo completo.
        </div>
      )}
    </div>
  );
}
