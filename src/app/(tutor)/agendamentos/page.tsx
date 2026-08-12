"use client";

import Card from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, Bell, Mail, Plus, Stethoscope, Syringe, Calendar } from "lucide-react";

const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const calendarDays = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
];

const highlightDays = [11, 12, 16, 19];
const today = 11;

const upcomingRecords = [
  { date: "12", title: "Reforço Anual de Saúde", time: "09:00 - 10:00 AM", icon: <Stethoscope size={16} /> },
  { date: "12", title: "Revisão Pós-Op Mensal", time: "02:00 PM", icon: <Stethoscope size={16} /> },
];

export default function AgendamentosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">Agenda & Bem-estar</h1>
        <p className="text-on-surface-variant mt-1">Gerenciando cuidados para 4 pacientes esta mês</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="font-headline text-xl font-bold">Outubro 2023</h2>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Saúde completa</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-sm text-on-surface-variant hover:text-primary font-medium">Mensal</button>
                <button className="text-sm text-primary font-semibold">Semanal</button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold text-on-surface-variant uppercase py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.flat().map((day) => (
                <button
                  key={day}
                  className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                    day === today
                      ? "bg-primary text-on-primary font-bold"
                      : highlightDays.includes(day)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </Card>

          {/* Monthly Health Pulse */}
          <div>
            <h2 className="font-headline text-lg font-bold mb-4">Pulso de Saúde Mensal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-primary/5 border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Stethoscope size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-sm">Exames de Rotina</h4>
                    <p className="text-xs text-on-surface-variant">4 para cada um dos pets este mês. Próximas datas disponíveis.</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-success/5 border-success/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                    <Syringe size={20} className="text-success" />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-sm">Status de Vacinas</h4>
                    <p className="text-xs text-on-surface-variant">Uma pendência de reforço de Antirrábica em 2 dias.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Next Appointment */}
          <Card className="bg-surface-container-low">
            <p className="text-xs text-on-surface-variant uppercase font-semibold mb-1">Próxima</p>
            <p className="font-headline font-bold text-on-surface">Amanhã, 10:00 AM</p>
            <p className="text-sm text-on-surface-variant">Agendamento Presencial</p>
          </Card>
        </div>

        {/* Right: Alerts & Notifications */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-headline font-bold mb-4 flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              Central de Alertas
            </h3>
            <div className="space-y-3 mb-4">
              <div className="text-xs">
                <p className="text-on-surface-variant uppercase font-semibold mb-1">102 notificações não lidas</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant">Severidade do alerta:</label>
                <div className="flex gap-2">
                  {["urgente", "importante", "rotina"].map((s) => (
                    <span key={s} className="text-[10px] px-2 py-1 rounded-full bg-surface-container-high text-on-surface-variant capitalize">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant">Notificações Push</span>
                <div className="w-9 h-5 bg-primary rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant">Resumo por E-mail</span>
                <div className="w-9 h-5 bg-surface-container-high rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5" />
                </div>
              </div>
            </div>

            <button className="w-full bg-primary-gradient text-on-primary font-semibold py-2.5 rounded-xl text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2">
              <Plus size={16} /> Criar Lembrete
            </button>
          </Card>

          {/* Upcoming Records */}
          <Card>
            <h3 className="font-headline font-bold text-sm mb-3 uppercase tracking-wider text-on-surface-variant">Cuidados e Registros Próximos</h3>
            <div className="space-y-3">
              {upcomingRecords.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {rec.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{rec.title}</p>
                    <p className="text-xs text-on-surface-variant">{rec.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
