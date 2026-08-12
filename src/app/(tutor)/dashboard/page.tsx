"use client";

import { Heart, Activity, Thermometer, Weight, Calendar, Clock, Syringe, Stethoscope, Plus, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Moon } from "lucide-react";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth-context";

const pets = [
  { name: "Luna", breed: "Golden Retriever", age: "2 Anos", status: "SAUDÁVEL", statusColor: "bg-success text-white", recovery: "Recuperação Pós-Op: 80%", img: "🐕", borderColor: "border-l-4 border-l-sky" },
  { name: "Oliver", breed: "Vira-lata (Persa/Curto)", age: "5 Anos", status: "ALERTA", statusColor: "bg-amber text-white", recovery: "Vacinação em 6 dias", img: "🐈", borderColor: "border-l-4 border-l-amber" },
];

const appointments = [
  { title: "Exame Geral de Rotina", pet: "Luna", vet: "Dr. Ana Thomé", date: "Segunda, 16 Out", time: "09:00", badge: "Em 2 Dias", badgeColor: "bg-amber-light text-amber-dark", iconBg: "bg-sky-light", iconColor: "text-sky", icon: <Stethoscope size={20} /> },
  { title: "Pacote de Vacinação", pet: "Oliver", vet: "Dra. Carla Melo", date: "Quinta, 19 Out", time: "14:30", badge: "Próxima Semana", badgeColor: "bg-primary/10 text-primary", iconBg: "bg-lavender-light", iconColor: "text-lavender", icon: <Syringe size={20} /> },
  { title: "Limpeza Dental", pet: "Oliver", vet: "Agendamento/Confirmação", date: "2x · 26 Out", time: "Parcial", badge: "Provisório", badgeColor: "bg-surface-container-high text-on-surface-variant", iconBg: "bg-coral-light", iconColor: "text-coral", icon: <Calendar size={20} /> },
];

const healthAlerts = [
  { type: "PRÓXIMA TAREFA", title: "Reforço Antirrábica - Oliver", date: "14 Out, 2023 • 11:00", icon: <Clock size={14} />, color: "text-amber" },
  { type: "NOTA DE CHECK-UP", title: "Incisão pós-op da Luna cicatrizando bem", date: "Registrado há 2h", icon: <CheckCircle size={14} />, color: "text-teal-light" },
  { type: "CONCLUÍDO", title: "Remédio mensal de verme", date: "Registrado em outubro", icon: <CheckCircle size={14} />, color: "text-white/50" },
];

const vitalSigns = [
  { label: "FREQ. CARDÍACA (LUNA)", value: "72", unit: "bpm", icon: <Heart size={16} />, color: "text-coral", bg: "bg-coral-light" },
  { label: "PASSOS DIÁRIOS (LUNA)", value: "8.432", unit: "", icon: <Activity size={16} />, color: "text-sky", bg: "bg-sky-light" },
  { label: "QUALIDADE DE SONO (OLIVER)", value: "94", unit: "%", icon: <Moon size={16} />, color: "text-lavender", bg: "bg-lavender-light" },
  { label: "ACOMPANHAMENTO DE PESO", value: "32,4", unit: "kg", icon: <Weight size={16} />, color: "text-amber", bg: "bg-amber-light" },
];

export default function TutorDashboard() {
  const { profile } = useAuth();
  const firstName = profile?.name?.split(" ")[0] || "Tutor";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">Bem-vindo de volta, {firstName}</h1>
        <p className="text-on-surface-variant mt-1">Os residentes do seu santuário estão bem hoje.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Main content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Pet Status Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline text-lg font-bold">Status de Bem-Estar</h2>
              <Link href="/pets" className="text-sm text-primary font-semibold hover:underline">Ver Todos os Registros</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <Card key={pet.name} className={`flex items-start gap-4 ${pet.borderColor}`}>
                  <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center text-3xl shrink-0">
                    {pet.img}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-headline font-bold text-on-surface">{pet.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${pet.statusColor}`}>{pet.status}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{pet.breed} • {pet.age}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{pet.recovery}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Vitals Chart Placeholder */}
          <Card>
            <h3 className="font-headline font-semibold text-sm mb-4">Tendências Vitais (Média Combinada)</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <div className="w-2 h-2 rounded-full bg-sky" /> Atividade
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <div className="w-2 h-2 rounded-full bg-coral" /> Frequência Cardíaca
              </div>
            </div>
            <div className="h-40 bg-surface-container-low rounded-xl flex items-end justify-around px-4 pb-4">
              {[40, 60, 55, 70, 65, 80, 75, 85, 70, 60, 55, 50].map((h, i) => (
                <div key={i} className="w-full max-w-[24px] mx-0.5 flex flex-col gap-0.5">
                  <div className="bg-sky/30 rounded-t" style={{ height: `${h}%` }} />
                  <div className="bg-coral/20 rounded-t" style={{ height: `${h * 0.6}%` }} />
                </div>
              ))}
            </div>
          </Card>

          {/* Appointments */}
          <div>
            <h2 className="font-headline text-lg font-bold mb-4">Próximos Agendamentos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {appointments.map((apt, i) => (
                <Card key={i}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${apt.iconBg} rounded-xl flex items-center justify-center ${apt.iconColor}`}>
                      {apt.icon}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${apt.badgeColor}`}>{apt.badge}</span>
                  </div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">{apt.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">{apt.pet} • {apt.vet}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-on-surface-variant">
                    <Calendar size={12} /> {apt.date}
                    <span className="ml-auto">{apt.time}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Pulse Health */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-headline font-bold">O Pulso de Saúde</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Monitoramento de sinais vitais em tempo real via wearables sincronizados.</p>
              </div>
              <div className="flex gap-2">
                {["Tempo Real", "Últimas 24h", "Última Semana"].map((label, i) => (
                  <button key={label} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${i === 0 ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vitalSigns.map((v, i) => (
                <div key={i} className={`${v.bg} rounded-xl p-4`}>
                  <div className={`${v.color} mb-2`}>{v.icon}</div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">{v.label}</p>
                  <p className="font-headline text-2xl font-bold text-on-surface mt-1">
                    {v.value} <span className="text-sm font-normal text-on-surface-variant">{v.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Health Alerts */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary-dark to-primary text-white border-none">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold flex items-center gap-2">
                <AlertTriangle size={18} /> Alertas de Saúde
              </h3>
              <div className="flex gap-1">
                <button className="p-1 rounded-lg hover:bg-white/10"><ChevronLeft size={16} /></button>
                <button className="p-1 rounded-lg hover:bg-white/10"><ChevronRight size={16} /></button>
              </div>
            </div>
            <div className="space-y-4">
              {healthAlerts.map((alert, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3">
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${alert.color}`}>{alert.type}</p>
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-white/60 text-xs">
                    {alert.icon} {alert.date}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="font-headline font-bold text-sm mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/importar-exames" className="flex flex-col items-center gap-2 p-4 bg-lavender-light rounded-xl hover:bg-lavender/20 transition-colors">
                <Activity size={20} className="text-lavender" />
                <span className="text-xs font-semibold text-on-surface-variant text-center">Importar Exame</span>
              </Link>
              <Link href="/agendamentos" className="flex flex-col items-center gap-2 p-4 bg-sky-light rounded-xl hover:bg-sky/20 transition-colors">
                <Calendar size={20} className="text-sky" />
                <span className="text-xs font-semibold text-on-surface-variant text-center">Agendar</span>
              </Link>
              <Link href="/prontuarios" className="flex flex-col items-center gap-2 p-4 bg-coral-light rounded-xl hover:bg-coral/20 transition-colors">
                <Stethoscope size={20} className="text-coral" />
                <span className="text-xs font-semibold text-on-surface-variant text-center">Prontuário</span>
              </Link>
              <Link href="/pets" className="flex flex-col items-center gap-2 p-4 bg-amber-light rounded-xl hover:bg-amber/20 transition-colors">
                <Heart size={20} className="text-amber" />
                <span className="text-xs font-semibold text-on-surface-variant text-center">Meus Pets</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
