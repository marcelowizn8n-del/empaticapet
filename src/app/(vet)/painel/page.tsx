"use client";

import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { Calendar, Clock, FileText, Stethoscope, Plus, Eye, Pill, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth-context";

const patients = [
  { name: "Bento", breed: "Golden Retriever", age: "5 anos", tutor: "Ricardo Alves", lastVisit: "12 Out 2023", img: "🐕" },
  { name: "Luna", breed: "Gato Persa", age: "3 anos", tutor: "Marina Silva", lastVisit: "05 Set 2023", img: "🐈" },
  { name: "Max", breed: "Pug", age: "2 anos", tutor: "Felipe Santos", lastVisit: "Ontem", img: "🐕" },
  { name: "Mel", breed: "SRD", age: "8 meses", tutor: "Carla Nunes", lastVisit: "31 Nov 2023", img: "🐕" },
];

const schedule = [
  { time: "09:00", title: "Consulta de Rotina", patient: "Thor (Labrador)", status: "CONFIRMADO", statusColor: "bg-success/10 text-success", dotColor: "bg-sky" },
  { time: "10:30", title: "Vacinação & Checkup", patient: "Pipoca (Gato)", status: "AGORA", statusColor: "bg-amber-light text-amber-dark", action: "Atender Agora", dotColor: "bg-amber" },
  { time: "14:00", title: "Retorno Pós-Cirúrgico", patient: "Bolinha (Shih Tzu)", status: "PENDENTE", statusColor: "bg-lavender-light text-lavender-dark", dotColor: "bg-lavender" },
  { time: "16:00", title: "Ultrassonografia", patient: "Miau (Gato)", status: "", statusColor: "", dotColor: "bg-coral" },
];

export default function PainelVeterinario() {
  const { profile } = useAuth();
  const firstName = profile?.name?.split(" ")[0] || "Doutor(a)";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Painel do Veterinário</h1>
          <p className="text-on-surface-variant mt-1">Bem-vindo de volta, {firstName}. Veja o que temos para hoje.</p>
        </div>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Eye size={16} /> Abrir Prontuário
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Pill size={16} /> Nova Prescrição
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ClipboardList size={16} /> Solicitar Exame
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="CONSULTAS HOJE" value="12" icon={<Calendar size={20} className="text-sky" />} accentColor="border-t-sky" />
        <StatCard label="EM ESPERA" value="04" icon={<Clock size={20} className="text-amber" />} badge="Em atendimento" badgeColor="bg-amber-light text-amber-dark" accentColor="border-t-amber" />
        <StatCard label="EXAMES PENDENTES" value="07" icon={<FileText size={20} className="text-lavender" />} accentColor="border-t-lavender" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline text-lg font-bold">Pacientes Recentes</h2>
              <Link href="/pacientes" className="text-sm text-primary font-semibold hover:underline">Ver todos</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patients.map((p) => (
                <Card key={p.name}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center text-2xl shrink-0">
                      {p.img}
                    </div>
                    <div>
                      <h4 className="font-headline font-bold">{p.name}</h4>
                      <p className="text-xs text-on-surface-variant">{p.breed} • {p.age}</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        <span className="font-semibold">Tutor:</span> {p.tutor}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        <span className="font-semibold">Última:</span> {p.lastVisit}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Health Trends */}
          <Card>
            <h3 className="font-headline font-bold mb-2">Tendências de Saúde</h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Acompanhe a evolução clínica média dos seus pacientes nos últimos 30 dias.
              Identifique padrões de vacinação e agendamentos.
            </p>
            <div className="h-48 bg-surface-container-low rounded-xl flex items-end justify-around px-4 pb-4">
              {[30, 45, 55, 40, 65, 70, 50, 60, 45, 55, 40, 35].map((h, i) => (
                <div key={i} className="w-full max-w-[28px] mx-0.5 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary/30 rounded-t" style={{ height: `${h}%` }} />
                  <div className="w-full bg-primary/10 rounded-t" style={{ height: `${h * 0.3}%` }} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Schedule */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold">Próximos Horários</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Hoje</span>
            </div>
            <div className="space-y-4">
              {schedule.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 ${s.dotColor} rounded-full mt-2 shrink-0`} />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-on-surface">{s.title}</h4>
                    <p className="text-xs text-on-surface-variant">Paciente: {s.patient}</p>
                    {s.status && (
                      <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${s.statusColor}`}>
                        {s.status}
                      </span>
                    )}
                    {s.action && (
                      <button className="mt-2 text-xs bg-primary text-on-primary px-3 py-1.5 rounded-lg font-semibold hover:opacity-90">
                        {s.action}
                      </button>
                    )}
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
