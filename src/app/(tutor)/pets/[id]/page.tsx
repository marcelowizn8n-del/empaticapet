"use client";

import Card from "@/components/ui/Card";
import { Save, X, AlertTriangle, Calendar } from "lucide-react";

const petData = {
  name: "Oliver",
  breed: "Beagle",
  age: "4 Anos",
  weight: "12.5",
  chip: "985112006456231",
  notes: "Oliver é levemente alérgico a ração seca à base de frango. Mostra sinais de ansiedade durante tempestades. Gosta de longos caminhos pelo parque, mas costuma ignorar caminhadas em clima úmido. O último check-up dentário estava normal.",
  tags: ["BEAGLE", "ID: BR42-K"],
};

const weightHistory = [12.0, 12.2, 12.1, 12.3, 12.4, 12.5, 12.3, 12.5];

export default function PetProfilePage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-on-surface-variant">
        Pets / <span className="text-on-surface font-medium">Perfil do {petData.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-surface-container-high rounded-2xl flex items-center justify-center text-4xl">
            🐈
          </div>
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-surface">{petData.name}</h1>
            <div className="flex gap-2 mt-2">
              {petData.tags.map((tag) => (
                <span key={tag} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-all flex items-center gap-2">
            <X size={16} /> Descartar
          </button>
          <button className="px-4 py-2.5 bg-primary-gradient text-on-primary rounded-xl text-sm font-semibold hover:opacity-95 transition-all flex items-center gap-2">
            <Save size={16} /> Salvar Alterações
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="font-headline font-bold text-lg mb-5">Detalhes de Identidade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant">Nome do Pet</label>
                <input defaultValue={petData.name} className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant">Raça</label>
                <input defaultValue={petData.breed} className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant">Idade</label>
                <div className="relative">
                  <input defaultValue={petData.age} className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant">Peso (kg)</label>
                <input defaultValue={petData.weight} className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" type="number" step="0.1" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-on-surface-variant">Número do Microchip</label>
                <input defaultValue={petData.chip} className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
            </div>
          </Card>

          {/* Weight Trend */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold">Tendência de Peso</h3>
              <span className="text-xs text-on-surface-variant">Medir: 12 Mtp</span>
            </div>
            <div className="h-40 bg-surface-container-low rounded-xl flex items-end justify-around px-4 pb-4">
              {weightHistory.map((w, i) => (
                <div key={i} className="flex flex-col items-center gap-1 w-full max-w-[32px]">
                  <div className="w-full bg-primary/30 rounded-t" style={{ height: `${(w - 11.5) * 80}%` }} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-headline font-bold mb-3">Notas de Saúde</h3>
            <p className="text-xs text-on-surface-variant mb-3">Use esta seção para registrar preferências alimentares, reações alérgicas ou observações comportamentais.</p>
            <textarea
              defaultValue={petData.notes}
              rows={6}
              className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm resize-none"
            />
          </Card>

          <Card className="bg-error/5 border-error/20">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-error shrink-0 mt-0.5" />
              <div>
                <p className="font-headline font-bold text-sm text-error">ALERTA PRÓXIMO</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Reforço de vacinação anual com vencimento em 12 dias. Agende a vacina o mais rápido possível.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
