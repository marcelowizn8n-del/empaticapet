"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { createClient } from "@/lib/supabase/client";
import type { Internacao, ICUShiftSummary } from "@/lib/internacoes";
import {
  STATUS_META,
  speciesEmoji,
  formatDateTime,
} from "@/lib/internacoes";
import {
  BedDouble,
  AlertTriangle,
  Eye,
  Sparkles,
  Loader2,
  MessageSquare,
  Activity,
  ArrowRight,
} from "lucide-react";

export default function AdminUTIPage() {
  const supabase = createClient();

  const [internacoes, setInternacoes] = useState<Internacao[]>([]);
  const [summaries, setSummaries] = useState<Record<string, ICUShiftSummary>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      try {
        const { data: internData, error: internError } = await supabase
          .from("internacoes")
          .select("*")
          .neq("status", "alta")
          .order("admitted_at", { ascending: false });

        if (internError) {
          setError(internError.message);
          setLoading(false);
          return;
        }

        const list = (internData as Internacao[]) || [];
        setInternacoes(list);

        if (list.length > 0) {
          const { data: summaryData } = await supabase
            .from("icu_shift_summaries")
            .select("*")
            .in(
              "internacao_id",
              list.map((i) => i.id)
            )
            .order("created_at", { ascending: false });

          const latestMap: Record<string, ICUShiftSummary> = {};
          for (const s of (summaryData as ICUShiftSummary[]) || []) {
            if (!latestMap[s.internacao_id]) {
              latestMap[s.internacao_id] = s;
            }
          }
          setSummaries(latestMap);
        }

        setLoading(false);
      } catch {
        setError("Não foi possível carregar a Central de Comando de UTI.");
        setLoading(false);
      }
    };
    load();
  }, [supabase]);

  const filtered = internacoes.filter((i) => {
    if (statusFilter === "all") return true;
    return i.status === statusFilter;
  });

  const counts = {
    total: internacoes.length,
    criticos: internacoes.filter((i) => i.status === "critico").length,
    observacao: internacoes.filter((i) => i.status === "observacao").length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header da Central */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-bold mb-2">
            <Activity size={14} /> Painel da Diretoria & Gestão
          </div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">
            Central de Comando da UTI
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Visão panorâmica dos leitos em tempo real com resumos clínicos sintetizados por IA.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-surface-container-highest border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 text-on-surface"
          >
            <option value="all">Todos os leitos ({counts.total})</option>
            <option value="critico">Apenas Críticos ({counts.criticos})</option>
            <option value="observacao">Em Observação ({counts.observacao})</option>
            <option value="internado">Estáveis ({counts.total - counts.criticos - counts.observacao})</option>
          </select>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="LEITOS OCUPADOS"
          value={String(counts.total).padStart(2, "0")}
          icon={<BedDouble size={20} className="text-sky" />}
          accentColor="border-t-sky"
        />
        <StatCard
          label="CASOS CRÍTICOS"
          value={String(counts.criticos).padStart(2, "0")}
          icon={<AlertTriangle size={20} className="text-error" />}
          accentColor="border-t-coral"
        />
        <StatCard
          label="EM OBSERVAÇÃO"
          value={String(counts.observacao).padStart(2, "0")}
          icon={<Eye size={20} className="text-amber" />}
          accentColor="border-t-amber"
        />
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-on-surface-variant">
          <Loader2 size={24} className="animate-spin" />
        </div>
      )}

      {error && !loading && (
        <Card className="bg-error-container/30 border-error/20">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-error shrink-0 mt-0.5" />
            <p className="text-sm text-on-surface-variant">{error}</p>
          </div>
        </Card>
      )}

      {!loading && !error && filtered.length === 0 && (
        <Card className="border-2 border-dashed border-outline-variant">
          <div className="py-12 text-center text-on-surface-variant space-y-2">
            <BedDouble size={32} className="mx-auto text-primary opacity-50" />
            <p className="font-headline font-bold text-base text-on-surface">
              Nenhum leito encontrado para o filtro selecionado
            </p>
          </div>
        </Card>
      )}

      {/* Grid de Leitos da UTI */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const status = STATUS_META[item.status];
            const sum = summaries[item.id];
            const sumData = sum?.summary_data;
            const hasAlerts = (sumData?.alertas?.length || 0) + (sumData?.pontos_criticos?.length || 0);

            return (
              <Card
                key={item.id}
                className="flex flex-col justify-between hover:shadow-md transition-all border border-outline-variant/15 relative overflow-hidden"
              >
                <div>
                  {/* Top Header do Card */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center text-2xl shrink-0">
                        {speciesEmoji(item.species)}
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-base text-on-surface leading-tight">
                          {item.pet_name}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {item.breed || "SRD"} {item.box ? `• ${item.box}` : ""}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold shrink-0 ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Motivo */}
                  <p className="text-xs text-on-surface-variant line-clamp-1 mb-3">
                    <span className="font-semibold text-on-surface">Motivo: </span>
                    {item.reason}
                  </p>

                  {/* Resumo Sintético da IA */}
                  {sumData ? (
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-3.5 space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                          <Sparkles size={13} />
                          SÍNTESE DA IA (CLAUDE)
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          {formatDateTime(sum.created_at)}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-on-surface">
                        {sumData.estado_geral}
                      </p>

                      {sumData.resumo && (
                        <p className="text-xs text-on-surface-variant line-clamp-2">
                          {sumData.resumo}
                        </p>
                      )}

                      {hasAlerts > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-error font-semibold pt-1 border-t border-primary/10">
                          <AlertTriangle size={13} />
                          <span>{hasAlerts} alerta(s) de atenção no plantão</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-surface-container-low rounded-xl p-3.5 mb-4 text-xs text-on-surface-variant flex items-center gap-2">
                      <MessageSquare size={15} className="text-primary opacity-60" />
                      <span>Ainda não há resumo compilado para este leito.</span>
                    </div>
                  )}
                </div>

                {/* Footer do Card / Ação */}
                <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                  <span className="text-[11px] text-on-surface-variant">
                    Entrada: {formatDateTime(item.admitted_at)}
                  </span>
                  <Link
                    href={`/internacoes/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    Abrir Chat ao Vivo <ArrowRight size={14} />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
