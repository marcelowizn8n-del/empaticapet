"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import NovaInternacaoModal from "@/components/internacoes/NovaInternacaoModal";
import { createClient } from "@/lib/supabase/client";
import type { Internacao, ShiftReport } from "@/lib/internacoes";
import {
  STATUS_META,
  speciesEmoji,
  formatDateTime,
} from "@/lib/internacoes";
import {
  Plus,
  BedDouble,
  AlertTriangle,
  Eye,
  Sparkles,
  Loader2,
  ClipboardList,
} from "lucide-react";

export default function InternacoesPage() {
  const supabase = createClient();
  const [internacoes, setInternacoes] = useState<Internacao[]>([]);
  const [latestByInternacao, setLatestByInternacao] = useState<
    Record<string, ShiftReport>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: internData, error: internError } = await supabase
        .from("internacoes")
        .select("*")
        .neq("status", "alta")
        .order("admitted_at", { ascending: false });

      if (internError) {
        setError(
          internError.message.includes("does not exist")
            ? "A tabela de internações ainda não existe. Rode o arquivo supabase-internacoes.sql no SQL Editor do Supabase."
            : internError.message
        );
        setLoading(false);
        return;
      }

      const list = (internData as Internacao[]) || [];
      setInternacoes(list);

      if (list.length > 0) {
        const { data: reports } = await supabase
          .from("shift_reports")
          .select("*")
          .in(
            "internacao_id",
            list.map((i) => i.id)
          )
          .order("created_at", { ascending: false });

        const latest: Record<string, ShiftReport> = {};
        for (const r of (reports as ShiftReport[]) || []) {
          if (!latest[r.internacao_id]) latest[r.internacao_id] = r;
        }
        setLatestByInternacao(latest);
      }

      setLoading(false);
    };
    load();
  }, [supabase]);

  const counts = {
    total: internacoes.length,
    criticos: internacoes.filter((i) => i.status === "critico").length,
    observacao: internacoes.filter((i) => i.status === "observacao").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">
            Internações & Plantão
          </h1>
          <p className="text-on-surface-variant mt-1">
            Pacientes internados e resumo da passagem de plantão por IA.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-gradient text-on-primary rounded-xl text-sm font-semibold hover:opacity-95 transition-all"
        >
          <Plus size={16} /> Nova Internação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="PACIENTES INTERNADOS"
          value={String(counts.total).padStart(2, "0")}
          icon={<BedDouble size={20} className="text-sky" />}
          accentColor="border-t-sky"
        />
        <StatCard
          label="EM ESTADO CRÍTICO"
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

      {loading && (
        <div className="flex items-center justify-center py-16 text-on-surface-variant">
          <Loader2 size={24} className="animate-spin" />
        </div>
      )}

      {error && !loading && (
        <Card className="bg-error-container/30 border-error/20">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-error shrink-0 mt-0.5" />
            <div>
              <h4 className="font-headline font-bold text-sm text-error">
                Não foi possível carregar as internações
              </h4>
              <p className="text-xs text-on-surface-variant mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {!loading && !error && internacoes.length === 0 && (
        <Card className="border-2 border-dashed border-outline-variant">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <BedDouble size={28} className="text-primary" />
            </div>
            <h3 className="font-headline font-bold text-lg mb-1">
              Nenhum paciente internado
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Registre uma internação para começar a passagem de plantão.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-gradient text-on-primary font-semibold px-6 py-3 rounded-xl hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Nova Internação
            </button>
          </div>
        </Card>
      )}

      {!loading && !error && internacoes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {internacoes.map((internacao) => {
            const status = STATUS_META[internacao.status];
            const latest = latestByInternacao[internacao.id];
            return (
              <Link
                key={internacao.id}
                href={`/internacoes/${internacao.id}`}
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center text-2xl shrink-0">
                      {speciesEmoji(internacao.species)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline font-bold truncate">
                          {internacao.pet_name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant truncate">
                        {internacao.breed || "SRD"}
                        {internacao.box ? ` • ${internacao.box}` : ""}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                        {internacao.reason}
                      </p>
                    </div>
                  </div>

                  {latest?.ai_summary ? (
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles size={13} className="text-primary" />
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                          Último plantão · {latest.shift_label}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-on-surface">
                        {latest.ai_summary.estado_geral}
                      </p>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">
                        {latest.ai_summary.resumo}
                      </p>
                      {latest.ai_summary.alertas.length > 0 && (
                        <p className="text-[11px] text-error font-medium mt-1.5 flex items-center gap-1">
                          <AlertTriangle size={11} />
                          {latest.ai_summary.alertas.length} alerta(s) ativo(s)
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-surface-container-low rounded-xl p-3 flex items-center gap-2">
                      <ClipboardList
                        size={14}
                        className="text-on-surface-variant"
                      />
                      <p className="text-xs text-on-surface-variant">
                        Nenhum relatório de plantão ainda.
                      </p>
                    </div>
                  )}

                  <p className="text-[11px] text-on-surface-variant mt-3">
                    Internado em {formatDateTime(internacao.admitted_at)}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {showModal && (
        <NovaInternacaoModal
          onClose={() => setShowModal(false)}
          onCreated={(internacao) => {
            setInternacoes((prev) => [internacao, ...prev]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
