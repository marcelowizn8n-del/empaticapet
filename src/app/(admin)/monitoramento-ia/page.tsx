"use client";

import Card from "@/components/ui/Card";
import { Brain, DollarSign, Clock, CheckCircle, AlertCircle, Activity, RefreshCw } from "lucide-react";

const recentExams = [
  { id: "#8829", time: "há 2 min", title: "Extração completa: Hemograma Completo - Golden Retriever 'Bento'", confidence: "0.94 Interno", credits: "0.02 créditos", status: "success" },
  { id: "#8828", time: "há 15 min", title: "Extração completa: Diagnóstico Sanguíneo - Persa 'Luna'", confidence: "0.96 Interno", credits: "0.03 créditos", status: "success" },
  { id: "#8827", time: "há 42 min", title: "Aviso: Imagem de baixa qualidade. Extração parcial realizada.", confidence: "", credits: "", status: "warning" },
];

export default function MonitoramentoIAPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">PAINEL DE CONTROLE</p>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Monitoramento Claude IA</h1>
          <p className="text-on-surface-variant mt-1">
            Acompanhe em tempo real a precisão e o volume de processamento da extração de dados médicos dos exames clínicos.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-on-surface-variant uppercase font-semibold">CRÉDITOS DISPONÍVEIS</p>
          <p className="font-headline text-2xl font-bold text-on-surface">$ 12.450,80</p>
          <button className="mt-2 bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl text-sm hover:opacity-95 transition-all">
            Recarregar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Volume Chart */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-headline font-bold">Volume de Requisições</h3>
                <p className="text-xs text-on-surface-variant">Últimos 7 dias de processamento</p>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">Claude 3.5 Sonnet</span>
            </div>
            <div className="h-56 bg-surface-container-low rounded-xl flex items-end justify-around px-6 pb-4">
              {[
                { label: "SEG", h: 55, color: "bg-sky/40 hover:bg-sky/60" },
                { label: "TER", h: 65, color: "bg-lavender/40 hover:bg-lavender/60" },
                { label: "QUA", h: 72, color: "bg-primary/40 hover:bg-primary/60" },
                { label: "QUI", h: 85, color: "bg-coral/40 hover:bg-coral/60" },
                { label: "SEX", h: 78, color: "bg-amber/40 hover:bg-amber/60" },
                { label: "SÁB", h: 42, color: "bg-teal/40 hover:bg-teal/60" },
                { label: "DOM", h: 28, color: "bg-rose/40 hover:bg-rose/60" },
              ].map((d) => (
                <div key={d.label} className="flex flex-col items-center gap-2 w-full max-w-[48px]">
                  <div className={`w-full ${d.color} rounded-t transition-colors cursor-pointer relative`} style={{ height: `${d.h}%` }}>
                    {d.h === 85 && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded">3.4k</span>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-medium">{d.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Exams */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold text-lg">Histórico Recente</h3>
              <button className="text-sm text-primary font-semibold hover:underline">Ver todos →</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentExams.map((exam) => (
                <Card key={exam.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {exam.status === "success" ? (
                        <CheckCircle size={16} className="text-success" />
                      ) : (
                        <AlertCircle size={16} className="text-warning" />
                      )}
                      <span className="font-headline font-bold text-sm">Exame {exam.id}</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant">{exam.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{exam.title}</p>
                  {exam.confidence && (
                    <div className="flex gap-3 mt-3 text-[10px] text-on-surface-variant">
                      <span>{exam.confidence}</span>
                      <span>{exam.credits}</span>
                    </div>
                  )}
                  {exam.status === "warning" && (
                    <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning font-semibold">
                      Ação manual necessária
                    </span>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* API Stability */}
          <Card>
            <h3 className="font-headline font-bold mb-2">Estabilidade da API Claude</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm font-medium text-success">Uptime: 99.98% (Normal)</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              O motor de IA Claude 3.5 Sonnet está operando dentro dos parâmetros de performance esperados,
              com latência média de 450ms por requisição.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="font-headline text-xl font-bold">3.2k</p>
                <p className="text-[10px] text-on-surface-variant uppercase">REQ/J</p>
              </div>
              <div>
                <p className="font-headline text-xl font-bold">12ms</p>
                <p className="text-[10px] text-on-surface-variant uppercase">P7 TFT</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Precision + Status */}
        <div className="space-y-6">
          {/* Precision */}
          <Card className="bg-primary-dark text-white border-none">
            <h3 className="font-headline font-bold mb-4">Precisão Média</h3>
            <p className="text-xs text-white/60 mb-4">Medida por revisão manual (QA)</p>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-white" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="96, 100" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-headline text-3xl font-bold">96%</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <div>
                <p className="text-white/60">META</p>
                <p className="font-bold">95%</p>
              </div>
              <div className="text-right">
                <p className="text-white/60">SISTEMA</p>
                <p className="font-bold">96%</p>
              </div>
            </div>
          </Card>

          {/* Network visualization placeholder */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} className="text-primary" />
              <h3 className="font-headline font-bold text-sm">Rede Neural</h3>
            </div>
            <div className="h-40 bg-surface-container-low rounded-xl flex items-center justify-center">
              <div className="flex gap-4 items-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex flex-col gap-2">
                    {[1, 2, 3].map((m) => (
                      <div key={m} className="w-3 h-3 bg-primary/30 rounded-full" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
