"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/auth-context";
import type { Internacao, Species, InternacaoStatus } from "@/lib/internacoes";
import { X, Loader2, PawPrint } from "lucide-react";

type Props = {
  onClose: () => void;
  onCreated: (internacao: Internacao) => void;
};

export default function NovaInternacaoModal({ onClose, onCreated }: Props) {
  const supabase = createClient();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    pet_name: "",
    species: "cão" as Species,
    breed: "",
    tutor_name: "",
    box: "",
    reason: "",
    status: "internado" as InternacaoStatus,
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pet_name.trim() || !form.reason.trim()) {
      setError("Preencha o nome do paciente e o motivo da internação.");
      return;
    }
    setSaving(true);
    setError("");

    const { data, error: insertError } = await supabase
      .from("internacoes")
      .insert({
        pet_name: form.pet_name.trim(),
        species: form.species,
        breed: form.breed.trim() || null,
        tutor_name: form.tutor_name.trim() || null,
        box: form.box.trim() || null,
        reason: form.reason.trim(),
        status: form.status,
        created_by: user?.id ?? null,
      })
      .select()
      .single();

    setSaving(false);

    if (insertError) {
      setError(
        insertError.message.includes("does not exist")
          ? "A tabela de internações ainda não existe. Rode o arquivo supabase-internacoes.sql no Supabase."
          : insertError.message
      );
      return;
    }

    onCreated(data as Internacao);
  };

  const inputClass =
    "w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm";
  const labelClass =
    "text-xs font-semibold text-on-surface-variant uppercase tracking-wider";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <PawPrint size={20} className="text-primary" />
            </div>
            <h2 className="font-headline font-bold text-lg">Nova Internação</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-xl"
          >
            <X size={18} className="text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Nome do paciente *</label>
              <input
                value={form.pet_name}
                onChange={(e) => update("pet_name", e.target.value)}
                className={inputClass}
                placeholder="Ex: Bento"
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Espécie</label>
              <select
                value={form.species}
                onChange={(e) => update("species", e.target.value)}
                className={inputClass}
              >
                <option value="cão">Cão</option>
                <option value="gato">Gato</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Raça</label>
              <input
                value={form.breed}
                onChange={(e) => update("breed", e.target.value)}
                className={inputClass}
                placeholder="Ex: Golden Retriever"
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Box / Leito</label>
              <input
                value={form.box}
                onChange={(e) => update("box", e.target.value)}
                className={inputClass}
                placeholder="Ex: Box 03"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Tutor</label>
            <input
              value={form.tutor_name}
              onChange={(e) => update("tutor_name", e.target.value)}
              className={inputClass}
              placeholder="Ex: Ricardo Alves"
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Motivo da internação *</label>
            <textarea
              value={form.reason}
              onChange={(e) => update("reason", e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Ex: Pós-operatório de gastrotomia, monitoramento de hidratação."
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Status inicial</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className={inputClass}
            >
              <option value="internado">Internado</option>
              <option value="observacao">Em observação</option>
              <option value="critico">Crítico</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-error bg-error-container/40 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-gradient text-on-primary font-semibold px-6 py-2.5 rounded-xl hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Salvando..." : "Internar paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
