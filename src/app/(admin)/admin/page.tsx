"use client";

import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { PawPrint, Users, Brain, CreditCard, Activity, Plus, ToggleLeft, ToggleRight, Settings, Shield } from "lucide-react";

const activityLog = [
  { title: "Novo usuário registrado", time: "há 2 minutos", detail: "Ana Carolina", type: "user", dotColor: "bg-sky" },
  { title: "Exame processado via IA", time: "há 5 minutos", detail: "Hemograma #8829", type: "ai", dotColor: "bg-lavender" },
  { title: "Alerta de crédito baixo", time: "há 15 min", detail: "Saldo < Limite", type: "alert", dotColor: "bg-amber" },
];

const accessUsers = [
  { name: "Marcos Pontes", role: "Editor", time: "4 dias", color: "text-primary" },
  { name: "Julia Mendez", role: "Moderador", time: "2 dias", color: "text-secondary" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">PAINEL DE CONTROLE</p>
        <h1 className="font-headline text-3xl font-bold text-on-surface">Monitoramento Claude IA</h1>
        <p className="text-on-surface-variant mt-1">Acompanhe em tempo real a precisão e o volume de processamento da extração de dados médicos dos exames clínicos.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="TOTAL DE PETS" value="1.284" icon={<PawPrint size={20} className="text-coral" />} trend="+12%" trendUp accentColor="border-t-coral" />
        <StatCard label="USUÁRIOS ATIVOS" value="842" icon={<Users size={20} className="text-sky" />} trend="+5.2%" trendUp accentColor="border-t-sky" />
        <StatCard label="EXAMES IA" value="4.502" icon={<Brain size={20} className="text-lavender" />} badge="Estável" badgeColor="bg-success/10 text-success" accentColor="border-t-lavender" />
        <StatCard label="CRÉDITOS CLAUDE" value="12.4k" icon={<CreditCard size={20} className="text-amber" />} accentColor="border-t-amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chart + Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Processing Chart */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-headline font-bold">Processamento de Diagnósticos (IA)</h3>
                <p className="text-xs text-on-surface-variant">Volume de requisições do Claude 3.5 Sonnet</p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant font-medium">7 DIAS</button>
                <button className="text-xs px-3 py-1.5 rounded-lg bg-primary text-on-primary font-medium">30 DIAS</button>
              </div>
            </div>
            <div className="h-52 bg-surface-container-low rounded-xl flex items-end justify-around px-4 pb-4">
              {[
                { label: "SEG", h: 55 },
                { label: "TER", h: 65 },
                { label: "QUA", h: 70 },
                { label: "QUI", h: 80 },
                { label: "SEX", h: 75 },
                { label: "SÁB", h: 45 },
                { label: "DOM", h: 30 },
              ].map((d) => (
                <div key={d.label} className="flex flex-col items-center gap-2 w-full max-w-[40px]">
                  <div className="w-full bg-primary/30 rounded-t relative" style={{ height: `${d.h}%` }}>
                    {d.h >= 75 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary">{(d.h * 40).toLocaleString()}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant">{d.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Log + Access */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-bold text-sm">Log de Atividades</h3>
                <button className="text-xs text-primary font-semibold hover:underline">Ver tudo</button>
              </div>
              <div className="space-y-3">
                {activityLog.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 ${item.dotColor} rounded-full mt-2 shrink-0`} />
                    <div>
                      <p className="text-sm font-medium text-on-surface">{item.title}</p>
                      <p className="text-xs text-on-surface-variant">{item.time} • {item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-headline font-bold text-sm mb-4">Gestão de Acesso</h3>
              <div className="space-y-3">
                {accessUsers.map((u, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center">
                      <Users size={16} className={u.color} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{u.name}</p>
                      <p className="text-xs text-on-surface-variant">{u.role} • {u.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Right: Credits + Config */}
        <div className="space-y-6">
          {/* AI Credits */}
          <Card className="bg-primary-dark text-white border-none">
            <h3 className="font-headline font-bold flex items-center gap-2 mb-4">
              <CreditCard size={18} /> Créditos de IA
            </h3>
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/70">Utilizado este mês</span>
                <span className="font-bold">82%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full">
                <div className="h-full bg-warning rounded-full" style={{ width: "82%" }} />
              </div>
            </div>
            <p className="text-xs text-white/70 mb-4">
              Seu consumo aumentou 12% nos últimos 8 dias. Considere escalar um upgrade para evitar interrupções na extração de diagnósticos automáticos.
            </p>
            <button className="w-full bg-white text-primary font-semibold py-2.5 rounded-xl text-sm hover:bg-white/90 transition-all">
              Recarregar Créditos
            </button>
          </Card>

          {/* Global Config */}
          <Card>
            <h3 className="font-headline font-bold text-sm mb-4">Configurações Globais</h3>
            <div className="space-y-4">
              {[
                { label: "Modo de Manutenção", active: false },
                { label: "Backup Automático", active: true },
                { label: "Diagnóstico Real-time", active: true },
              ].map((c) => (
                <div key={c.label} className="flex items-center justify-between">
                  <span className="text-sm text-on-surface">{c.label}</span>
                  <div className={`w-10 h-6 rounded-full relative cursor-pointer ${c.active ? "bg-primary" : "bg-surface-container-high"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${c.active ? "right-1" : "left-1"}`} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs text-primary font-semibold hover:underline text-left">
              Acessar todas as configurações →
            </button>
          </Card>

          {/* System Status */}
          <Card className="bg-surface-container-low">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-success" />
              <span className="text-xs font-semibold text-on-surface-variant">Sistema Operacional</span>
            </div>
            <p className="text-xs text-on-surface-variant">Todos os serviços operando. Uptime 99.9%.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
