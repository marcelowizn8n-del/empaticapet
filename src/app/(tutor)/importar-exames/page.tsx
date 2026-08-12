"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { Upload, FileText, CheckCircle, AlertCircle, Brain, ArrowRight, X, Loader2 } from "lucide-react";

type ExamState = "idle" | "uploading" | "analyzing" | "review" | "confirmed";

const mockExtractedData = {
  data: "15/09/2023",
  tipo: "Hemograma Completo",
  resultado: "Normal - Todos os valores dentro da faixa fisiológica",
  observacoes: "Hemoglobina 14.2 g/dL, Leucócitos 8.500/mm³, Plaquetas 285.000/mm³. Sem sinais de infecção ou anemia.",
  confianca: 96,
};

export default function ImportarExamesPage() {
  const [state, setState] = useState<ExamState>("idle");
  const [fileName, setFileName] = useState("");

  const handleUpload = () => {
    setFileName("hemograma_luna_set2023.pdf");
    setState("uploading");
    setTimeout(() => setState("analyzing"), 1500);
    setTimeout(() => setState("review"), 4000);
  };

  const handleConfirm = () => {
    setState("confirmed");
    setTimeout(() => setState("idle"), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">Importação de Exames com IA</h1>
        <p className="text-on-surface-variant mt-1">
          Faça upload de PDFs ou imagens de exames para extração automática de dados via Claude IA.
        </p>
      </div>

      {/* Upload Area */}
      {state === "idle" && (
        <Card className="border-2 border-dashed border-outline-variant hover:border-primary transition-colors">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Upload size={28} className="text-primary" />
            </div>
            <h3 className="font-headline font-bold text-lg mb-1">Arraste arquivos aqui</h3>
            <p className="text-sm text-on-surface-variant mb-4">ou clique para selecionar. PDF, JPG, PNG até 10MB.</p>
            <button
              onClick={handleUpload}
              className="bg-primary-gradient text-on-primary font-semibold px-6 py-3 rounded-xl hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Upload size={16} /> Selecionar Arquivo
            </button>
          </div>
        </Card>
      )}

      {/* Uploading / Analyzing */}
      {(state === "uploading" || state === "analyzing") && (
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-on-surface">{fileName}</p>
              <p className="text-xs text-on-surface-variant">245 KB</p>
            </div>
            <button onClick={() => setState("idle")} className="p-2 hover:bg-surface-container-high rounded-xl">
              <X size={16} className="text-on-surface-variant" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Step 1: Upload */}
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-success" />
              <span className="text-sm font-medium text-on-surface">Arquivo enviado com sucesso</span>
            </div>

            {/* Step 2: AI Analysis */}
            <div className="flex items-center gap-3">
              {state === "analyzing" ? (
                <Loader2 size={20} className="text-primary animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-outline-variant" />
              )}
              <span className={`text-sm font-medium ${state === "analyzing" ? "text-primary" : "text-on-surface-variant"}`}>
                {state === "analyzing" ? "Analisando com Claude IA..." : "Aguardando análise IA"}
              </span>
            </div>

            {state === "analyzing" && (
              <div className="ml-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={16} className="text-primary" />
                  <span className="text-xs font-semibold text-primary">Claude 3.5 Sonnet</span>
                </div>
                <p className="text-xs text-on-surface-variant">Extraindo dados do documento... Identificando tipo de exame, resultados e observações clínicas.</p>
                <div className="mt-3 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "60%" }} />
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-outline-variant" />
              <span className="text-sm font-medium text-on-surface-variant">Validação do usuário</span>
            </div>
          </div>
        </Card>
      )}

      {/* Review Extracted Data */}
      {state === "review" && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain size={24} className="text-primary" />
              <div>
                <h3 className="font-headline font-bold">Dados Extraídos pela IA</h3>
                <p className="text-xs text-on-surface-variant">Revise e confirme os dados antes de salvar no prontuário.</p>
              </div>
            </div>
            <span className="text-xs bg-success/10 text-success px-3 py-1 rounded-full font-semibold">
              {mockExtractedData.confianca}% confiança
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Data do Exame</label>
                <input defaultValue={mockExtractedData.data} className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Tipo de Exame</label>
                <input defaultValue={mockExtractedData.tipo} className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase">Resultado</label>
              <input defaultValue={mockExtractedData.resultado} className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase">Observações Clínicas</label>
              <textarea defaultValue={mockExtractedData.observacoes} rows={3} className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm resize-none" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/20">
            <button onClick={() => setState("idle")} className="px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-all">
              Descartar
            </button>
            <button onClick={handleConfirm} className="bg-primary-gradient text-on-primary font-semibold px-6 py-2.5 rounded-xl hover:opacity-95 transition-all flex items-center gap-2">
              Confirmar e Salvar
              <ArrowRight size={16} />
            </button>
          </div>
        </Card>
      )}

      {/* Confirmed */}
      {state === "confirmed" && (
        <Card className="bg-success/5 border-success/20">
          <div className="flex items-center gap-4 py-4">
            <CheckCircle size={32} className="text-success" />
            <div>
              <h3 className="font-headline font-bold text-success">Exame Salvo com Sucesso!</h3>
              <p className="text-sm text-on-surface-variant">Os dados foram adicionados ao prontuário de Luna.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Duplicate Detection Info */}
      <Card className="bg-surface-container-low">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-warning shrink-0 mt-0.5" />
          <div>
            <h4 className="font-headline font-bold text-sm">Bloqueio de Duplicatas</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              O sistema calcula um hash do arquivo enviado e compara data/tipo/resultado para impedir que o mesmo exame seja importado duas vezes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
