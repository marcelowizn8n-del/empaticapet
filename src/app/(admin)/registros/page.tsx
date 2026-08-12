"use client";

import Card from "@/components/ui/Card";
import { Search, Filter, Download, FileText } from "lucide-react";

const records = [
  { id: "#REC-4521", type: "Hemograma", patient: "Luna", vet: "Dra. Beatriz", date: "15 Out, 2023", status: "Processado", ia: true },
  { id: "#REC-4520", type: "Raio-X", patient: "Bento", vet: "Dr. Carlos", date: "14 Out, 2023", status: "Processado", ia: true },
  { id: "#REC-4519", type: "Ultrassom", patient: "Max", vet: "Dra. Beatriz", date: "13 Out, 2023", status: "Pendente", ia: false },
  { id: "#REC-4518", type: "Bioquímico", patient: "Thor", vet: "Dr. Carlos", date: "12 Out, 2023", status: "Processado", ia: true },
  { id: "#REC-4517", type: "Consulta", patient: "Mel", vet: "Dra. Ana", date: "11 Out, 2023", status: "Finalizado", ia: false },
];

export default function RegistrosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Registros Clínicos</h1>
          <p className="text-on-surface-variant mt-1">Todos os registros médicos do ecossistema.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high">
          <Download size={16} /> Exportar
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Buscar exames ou registros..."
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-highest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high">
          <Filter size={14} /> Filtros
        </button>
      </div>

      <Card padding={false}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/20">
              <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">ID</th>
              <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">Tipo</th>
              <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">Paciente</th>
              <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">Veterinário</th>
              <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">Data</th>
              <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">Status</th>
              <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">IA</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors cursor-pointer">
                <td className="p-4 text-sm font-mono text-primary">{r.id}</td>
                <td className="p-4 text-sm font-medium">{r.type}</td>
                <td className="p-4 text-sm">{r.patient}</td>
                <td className="p-4 text-sm text-on-surface-variant">{r.vet}</td>
                <td className="p-4 text-sm text-on-surface-variant">{r.date}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    r.status === "Processado" ? "bg-success/10 text-success" :
                    r.status === "Pendente" ? "bg-warning/10 text-warning" :
                    "bg-surface-container-high text-on-surface-variant"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-4">
                  {r.ia && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">IA</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
