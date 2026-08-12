"use client";

import Card from "@/components/ui/Card";
import { Download, Plus, AlertTriangle, Heart, Thermometer, Weight, Calendar, Pill, Tag, FileText, Upload } from "lucide-react";
import Link from "next/link";

const records = [
  {
    date: "12",
    month: "OUT",
    year: "2023",
    title: "Check-up Geral Anual",
    type: "Rotina",
    typeColor: "bg-primary/10 text-primary",
    vet: "Dra. Sarah Jenkins",
    description: "Exame físico de rotina. Frequência cardíaca e ritmo respiratório normais. Condição da pelagem excelente. Recomendada leve redução na ingestão calórica para manter o peso ideal.",
    vitals: [
      { label: "PESO", value: "28.4 kg", icon: <Weight size={14} /> },
      { label: "TEMP", value: "38.5°C", icon: <Thermometer size={14} /> },
      { label: "RESULTADO", value: "Saudável", icon: <Heart size={14} /> },
    ],
  },
  {
    date: "24",
    month: "AGO",
    year: "2023",
    title: "Painel Sanguíneo Diagnóstico",
    type: "Resultado de Lab",
    typeColor: "bg-secondary/10 text-secondary",
    vet: "Laboratório Central de Diagnóstico",
    description: "Hemograma completo e painel bioquímico para investigar letargia relatada. Todos os níveis dentro da faixa fisiológica normal. Sem sinais de infecção ou disfunção orgânica.",
    tags: ["Hemograma: Normal", "Fígado: Normal", "Glicose: 5.2 mmol/L"],
  },
  {
    date: "05",
    month: "JUN",
    year: "2023",
    title: "Atendimento de Emergência",
    type: "Lesão",
    typeColor: "bg-error/10 text-error",
    vet: "Dr. Mark Taylor",
    description: "Laceração na almofada da pata dianteira direita. Limpa e enfaixada. Administrado anestésico local e realizadas duas suturas. Prescrito curso de 7 dias de antibióticos.",
    prescription: { name: "Amoxicilina 250mg", note: "8/8h por 7 dias (Concluído)" },
  },
];

export default function ProntuariosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Histórico Médico</h1>
          <p className="text-on-surface-variant mt-1">Registros abrangentes para <strong>Luna, a Labrador</strong></p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-all">
            <Download size={16} /> Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-gradient text-on-primary rounded-xl text-sm font-semibold hover:opacity-95 transition-all">
            <Plus size={16} /> Novo Registro
          </button>
        </div>
      </div>

      {/* AI Import Banner */}
      <Card className="bg-gradient-to-r from-primary-dark to-primary text-white border-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Upload size={24} />
            <div>
              <h3 className="font-headline font-bold">Importação de Exames com IA</h3>
              <p className="text-white/80 text-sm">Faça upload de PDFs ou imagens de exames para extração automática de dados.</p>
            </div>
          </div>
          <Link href="/importar-exames" className="bg-white text-primary font-semibold px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition-all">
            Selecionar Arquivos
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Health Pulse + Records */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Pulse */}
          <Card>
            <h3 className="font-headline font-bold mb-3">Pulso de Saúde</h3>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-4xl font-bold text-primary">98</span>
              <span className="text-sm text-on-surface-variant">Índice de Vitalidade</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
              <div>
                <p className="text-xs text-on-surface-variant uppercase">Última Visita</p>
                <p className="font-semibold">12 de Out, 2023</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase">Vacinas</p>
                <p className="font-semibold text-success">Em dia</p>
              </div>
            </div>
          </Card>

          {/* Records */}
          <div>
            <h2 className="font-headline text-lg font-bold mb-4">Consultas e Exames Anteriores</h2>
            <div className="space-y-4">
              {records.map((rec, i) => (
                <Card key={i}>
                  <div className="flex gap-5">
                    {/* Date */}
                    <div className="text-center shrink-0">
                      <p className="text-xs text-on-surface-variant uppercase">{rec.month}</p>
                      <p className="font-headline text-2xl font-bold text-on-surface">{rec.date}</p>
                      <p className="text-xs text-on-surface-variant">{rec.year}</p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-headline font-bold text-on-surface">{rec.title}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">···</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${rec.typeColor}`}>{rec.type}</span>
                        <span className="text-xs text-on-surface-variant">{rec.vet}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{rec.description}</p>

                      {rec.vitals && (
                        <div className="flex gap-6 mt-3">
                          {rec.vitals.map((v, j) => (
                            <div key={j} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                              {v.icon}
                              <span className="uppercase font-semibold">{v.label}</span>
                              <span className="text-on-surface font-bold">{v.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {rec.tags && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {rec.tags.map((tag) => (
                            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-medium">{tag}</span>
                          ))}
                        </div>
                      )}

                      {rec.prescription && (
                        <div className="mt-3 flex items-center gap-2 text-xs bg-surface-container-low p-2.5 rounded-xl">
                          <Pill size={14} className="text-primary shrink-0" />
                          <div>
                            <span className="font-semibold text-on-surface">{rec.prescription.name}</span>
                            <span className="text-on-surface-variant ml-1">{rec.prescription.note}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button className="px-6 py-2.5 border border-outline-variant rounded-full text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-all">
                Carregar Registros Antigos
              </button>
            </div>
          </div>
        </div>

        {/* Right: Alerts */}
        <div>
          <Card className="bg-primary-dark text-white border-none">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-headline font-bold text-sm">Próximos</p>
                <p className="text-white/80 text-xs mt-1">
                  Reforço da antirrábica em 14 dias. Recomendamos agendar para esta semana.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
