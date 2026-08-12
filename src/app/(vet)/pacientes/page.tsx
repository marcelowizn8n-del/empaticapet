"use client";

import Card from "@/components/ui/Card";
import { Search, Filter } from "lucide-react";

const patients = [
  { name: "Bento", breed: "Golden Retriever", age: "5 anos", tutor: "Ricardo Alves", lastVisit: "12 Out 2023", status: "Saudável" },
  { name: "Luna", breed: "Gato Persa", age: "3 anos", tutor: "Marina Silva", lastVisit: "05 Set 2023", status: "Em tratamento" },
  { name: "Max", breed: "Pug", age: "2 anos", tutor: "Felipe Santos", lastVisit: "Ontem", status: "Saudável" },
  { name: "Mel", breed: "SRD", age: "8 meses", tutor: "Carla Nunes", lastVisit: "31 Nov 2023", status: "Vacinação pendente" },
  { name: "Thor", breed: "Bulldog Inglês", age: "3 anos", tutor: "Pedro Mendes", lastVisit: "Hoje", status: "Pré-cirúrgico" },
  { name: "Pipoca", breed: "Gato SRD", age: "1 ano", tutor: "Ana Lima", lastVisit: "15 Out 2023", status: "Saudável" },
];

export default function PacientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Meus Pacientes</h1>
          <p className="text-on-surface-variant mt-1">Todos os pacientes sob seu cuidado.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Buscar paciente por nome, tutor ou raça..."
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-highest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high">
          <Filter size={14} /> Filtrar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((p) => (
          <Card key={p.name} className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center text-2xl">
                {p.breed.includes("Gato") ? "🐈" : "🐕"}
              </div>
              <div>
                <h3 className="font-headline font-bold">{p.name}</h3>
                <p className="text-xs text-on-surface-variant">{p.breed} • {p.age}</p>
              </div>
            </div>
            <div className="text-xs text-on-surface-variant space-y-1">
              <p><span className="font-semibold">Tutor:</span> {p.tutor}</p>
              <p><span className="font-semibold">Última visita:</span> {p.lastVisit}</p>
            </div>
            <div className="mt-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                p.status === "Saudável" ? "bg-success/10 text-success" :
                p.status === "Em tratamento" ? "bg-warning/10 text-warning" :
                p.status === "Pré-cirúrgico" ? "bg-error/10 text-error" :
                "bg-secondary/10 text-secondary"
              }`}>
                {p.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
