"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, Heart, Thermometer, X } from "lucide-react";

const days = [
  { day: "SEG", date: 14, events: [
    { time: "09:00", title: "Consulta Max L.", type: "consulta", color: "bg-primary/10 border-primary/30 text-primary-dark" },
    { time: "11:00", title: "Vacinação Luna L.", type: "vacina", color: "bg-success/10 border-success/30 text-success" },
  ]},
  { day: "TER", date: 15, events: [
    { time: "10:00", title: "Consulta Thor (Bulldog)", type: "consulta", color: "bg-primary/10 border-primary/30 text-primary-dark" },
    { time: "14:00", title: "Cirurgia Bolinha", type: "cirurgia", color: "bg-warning/10 border-warning/30 text-warning" },
  ]},
  { day: "QUA", date: 16, events: [
    { time: "09:00", title: "Retorno Pipoca (Gato)", type: "consulta", color: "bg-primary/10 border-primary/30 text-primary-dark" },
  ]},
  { day: "QUI", date: 17, events: [
    { time: "10:00", title: "Vacinação Bento", type: "vacina", color: "bg-success/10 border-success/30 text-success" },
  ]},
  { day: "SEX", date: 18, events: [] },
  { day: "SÁB", date: 19, events: [] },
  { day: "DOM", date: 20, events: [] },
];

const filterTabs = ["CONSULTAS", "CIRURGIAS", "VACINAS", "Agend..."];

export default function AgendaVeterinario() {
  const [selectedEvent, setSelectedEvent] = useState<{ title: string; patient: string } | null>({
    title: "Cirurgia de correção de pálpebra",
    patient: "Thor - Bulldog Inglês • 3 anos",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold text-on-surface">Agenda do Veterinário</h1>
        <div className="flex gap-3">
          <button className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-lg">Semanal</button>
          <button className="text-sm font-medium text-on-surface-variant hover:bg-surface-container-high px-4 py-2 rounded-lg">Hoje</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all font-medium uppercase tracking-wider"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
              <button className="p-1 hover:bg-surface-container-high rounded-lg"><ChevronLeft size={18} /></button>
              <div className="flex gap-4">
                {days.map((d) => (
                  <div key={d.date} className="text-center">
                    <p className="text-[10px] text-on-surface-variant font-semibold">{d.day}</p>
                    <p className={`text-sm font-bold mt-0.5 ${d.date === 15 ? "text-primary" : "text-on-surface"}`}>{d.date}</p>
                  </div>
                ))}
              </div>
              <button className="p-1 hover:bg-surface-container-high rounded-lg"><ChevronRight size={18} /></button>
            </div>

            {/* Time Slots */}
            <div className="p-4 space-y-1">
              {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((time) => (
                <div key={time} className="grid grid-cols-8 gap-2 min-h-[48px]">
                  <div className="text-[10px] text-on-surface-variant font-medium pt-1">{time}</div>
                  {days.map((d) => {
                    const event = d.events.find((e) => e.time === time);
                    return (
                      <div key={d.date} className="relative">
                        {event ? (
                          <button
                            onClick={() => setSelectedEvent({ title: event.title, patient: "Paciente" })}
                            className={`w-full text-left p-1.5 rounded-lg border text-[10px] font-medium leading-tight ${event.color} hover:opacity-80 transition-opacity`}
                          >
                            {event.title}
                          </button>
                        ) : (
                          <div className="w-full h-full border-b border-outline-variant/10" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Event Detail */}
        <div className="space-y-6">
          {selectedEvent && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-bold text-sm">Detalhes da Visita</h3>
                <button onClick={() => setSelectedEvent(null)} className="p-1 hover:bg-surface-container-high rounded-lg">
                  <X size={16} className="text-on-surface-variant" />
                </button>
              </div>

              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 bg-surface-container-high rounded-2xl flex items-center justify-center text-3xl mb-3">
                  🐕
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">OCUPADO</span>
              </div>

              <div className="text-center mb-4">
                <h4 className="font-headline font-bold text-primary">Thor</h4>
                <p className="text-xs text-on-surface-variant">Bulldog Inglês • 3 anos</p>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <p className="text-on-surface-variant flex items-center gap-2">
                  <span className="font-semibold text-on-surface">Tutor:</span> Pedro Mendes
                </p>
                <p className="text-on-surface-variant leading-relaxed">
                  Cirurgia de correção de pálpebra (Entrópio). Jejum de 12 horas confirmado.
                </p>
              </div>

              <div className="flex gap-2 mb-6">
                <button className="flex-1 bg-primary text-on-primary font-semibold py-2.5 rounded-xl text-sm hover:opacity-95">
                  Iniciar Consulta
                </button>
                <button className="flex-1 border border-outline-variant text-on-surface-variant font-semibold py-2.5 rounded-xl text-sm hover:bg-surface-container-high">
                  Reagendar
                </button>
              </div>

              {/* Vital Signs */}
              <div className="bg-primary-dark rounded-xl p-4 text-white">
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider mb-3">Sinais Vitais Recentes</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70 flex items-center gap-1"><Heart size={12} /> Frequência Cardíaca</span>
                    <span className="font-bold">84 BPM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70 flex items-center gap-1"><Thermometer size={12} /> Temperatura</span>
                    <span className="font-bold">38.5°C</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/50 mt-3">Ver Histórico Completo</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
