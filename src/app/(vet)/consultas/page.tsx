"use client";

import Card from "@/components/ui/Card";
import { Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";

const consultas = [
  { id: 1, patient: "Thor", breed: "Bulldog Inglês", tutor: "Pedro Mendes", type: "Cirurgia", time: "09:00", status: "Em andamento", statusColor: "bg-warning/10 text-warning" },
  { id: 2, patient: "Pipoca", breed: "Gato SRD", tutor: "Ana Lima", type: "Vacinação", time: "10:30", status: "Aguardando", statusColor: "bg-secondary/10 text-secondary" },
  { id: 3, patient: "Bento", breed: "Golden Retriever", tutor: "Ricardo Alves", type: "Retorno", time: "14:00", status: "Confirmado", statusColor: "bg-success/10 text-success" },
  { id: 4, patient: "Luna", breed: "Gato Persa", tutor: "Marina Silva", type: "Exame", time: "15:30", status: "Confirmado", statusColor: "bg-success/10 text-success" },
];

export default function ConsultasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Consultas</h1>
          <p className="text-on-surface-variant mt-1">Gerencie suas consultas do dia.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-gradient text-on-primary rounded-xl text-sm font-semibold hover:opacity-95 transition-all">
          <Plus size={16} /> Nova Consulta
        </button>
      </div>

      <div className="space-y-4">
        {consultas.map((c) => (
          <Card key={c.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-high rounded-2xl flex items-center justify-center text-xl">
                  {c.breed.includes("Gato") ? "🐈" : "🐕"}
                </div>
                <div>
                  <h3 className="font-headline font-bold">{c.patient}</h3>
                  <p className="text-xs text-on-surface-variant">{c.breed} • Tutor: {c.tutor}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-medium">{c.type}</span>
                  <p className="text-sm font-medium text-on-surface-variant mt-1 flex items-center gap-1">
                    <Clock size={12} /> {c.time}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${c.statusColor}`}>
                  {c.status}
                </span>
                <button className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-95 transition-all">
                  Atender
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
