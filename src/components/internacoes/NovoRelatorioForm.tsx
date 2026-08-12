"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/auth-context";
import type { Internacao, ShiftReport } from "@/lib/internacoes";
import type { ShiftSummary } from "@/lib/ai";
import {
  Mic,
  Square,
  Trash2,
  Loader2,
  Sparkles,
  FileText,
} from "lucide-react";

type Props = {
  internacao: Internacao;
  onCreated: (report: ShiftReport) => void;
};

type Phase =
  | "idle"
  | "uploading"
  | "transcribing"
  | "summarizing"
  | "saving";

const SHIFT_OPTIONS = [
  "Plantão Diurno",
  "Plantão Noturno",
  "Plantão Matutino",
  "Plantão Vespertino",
  "Intercorrência",
];

const PHASE_LABEL: Record<Phase, string> = {
  idle: "",
  uploading: "Enviando áudio...",
  transcribing: "Transcrevendo áudio (OpenAI)...",
  summarizing: "Resumindo com Claude IA...",
  saving: "Salvando relatório...",
};

export default function NovoRelatorioForm({ internacao, onCreated }: Props) {
  const supabase = createClient();
  const { user, profile } = useAuth();

  const [shiftLabel, setShiftLabel] = useState(SHIFT_OPTIONS[0]);
  const [writtenReport, setWrittenReport] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");

  // Gravação de áudio
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const busy = phase !== "idle";

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setAudioBlob(blob);
        setAudioPreview(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError(
        "Não foi possível acessar o microfone. Verifique a permissão do navegador."
      );
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const discardAudio = () => {
    if (audioPreview) URL.revokeObjectURL(audioPreview);
    setAudioBlob(null);
    setAudioPreview(null);
  };

  const resetForm = () => {
    setWrittenReport("");
    discardAudio();
    setShiftLabel(SHIFT_OPTIONS[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!writtenReport.trim() && !audioBlob) {
      setError("Escreva o relatório ou grave um áudio da passagem de plantão.");
      return;
    }

    try {
      let audioPath: string | null = null;
      let transcription: string | null = null;

      // 1. Áudio: upload + transcrição
      if (audioBlob) {
        setPhase("uploading");
        const ext = audioBlob.type.includes("mp4") ? "mp4" : "webm";
        audioPath = `${internacao.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("plantao-audios")
          .upload(audioPath, audioBlob, {
            contentType: audioBlob.type || "audio/webm",
          });
        if (uploadError) throw new Error(`Falha ao enviar áudio: ${uploadError.message}`);

        setPhase("transcribing");
        const audioFile = new File([audioBlob], `plantao.${ext}`, {
          type: audioBlob.type || "audio/webm",
        });
        const fd = new FormData();
        fd.append("audio", audioFile);
        const res = await fetch("/api/plantao/transcrever", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro na transcrição.");
        transcription = data.transcription as string;
      }

      // 2. Resumo da IA
      const fullText = [writtenReport.trim(), transcription]
        .filter(Boolean)
        .join("\n\n");

      setPhase("summarizing");
      const resumoRes = await fetch("/api/plantao/resumir", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          petName: internacao.pet_name,
          species: internacao.species,
          reason: internacao.reason,
          reportText: fullText,
        }),
      });
      const resumoData = await resumoRes.json();
      if (!resumoRes.ok)
        throw new Error(resumoData.error || "Erro ao gerar o resumo.");
      const summary = resumoData.summary as ShiftSummary;

      // 3. Salvar o relatório
      setPhase("saving");
      const { data: inserted, error: insertError } = await supabase
        .from("shift_reports")
        .insert({
          internacao_id: internacao.id,
          author_id: user?.id ?? null,
          author_name: profile?.name ?? null,
          shift_label: shiftLabel,
          written_report: writtenReport.trim() || null,
          audio_url: audioPath,
          transcription,
          ai_summary: summary,
        })
        .select()
        .single();
      if (insertError) throw new Error(insertError.message);

      onCreated(inserted as ShiftReport);
      resetForm();
      setPhase("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setPhase("idle");
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm";
  const labelClass =
    "text-xs font-semibold text-on-surface-variant uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className={labelClass}>Turno</label>
        <select
          value={shiftLabel}
          onChange={(e) => setShiftLabel(e.target.value)}
          disabled={busy}
          className={inputClass}
        >
          {SHIFT_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Relatório escrito</label>
        <textarea
          value={writtenReport}
          onChange={(e) => setWrittenReport(e.target.value)}
          disabled={busy}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Descreva evolução, sinais vitais, medicações administradas, alimentação, eliminações, intercorrências e pendências..."
        />
      </div>

      {/* Gravação de áudio */}
      <div className="space-y-1.5">
        <label className={labelClass}>Áudio da passagem de plantão</label>
        <div className="bg-surface-container-low rounded-xl p-4">
          {!audioPreview ? (
            <div className="flex items-center gap-3">
              {!recording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={busy}
                  className="flex items-center gap-2 bg-primary text-on-primary text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-95 transition-all disabled:opacity-60"
                >
                  <Mic size={16} /> Gravar áudio
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-error text-on-error text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-95 transition-all"
                >
                  <Square size={16} /> Parar gravação
                </button>
              )}
              {recording && (
                <span className="flex items-center gap-2 text-sm text-error font-medium">
                  <span className="w-2.5 h-2.5 bg-error rounded-full animate-pulse" />
                  Gravando...
                </span>
              )}
              {!recording && (
                <span className="text-xs text-on-surface-variant">
                  Opcional — a IA transcreve e resume automaticamente.
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <audio controls src={audioPreview} className="h-10 flex-1" />
              <button
                type="button"
                onClick={discardAudio}
                disabled={busy}
                className="p-2.5 hover:bg-surface-container-high rounded-xl text-error disabled:opacity-60"
                title="Descartar áudio"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-error bg-error-container/40 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
          <Sparkles size={14} className="text-primary" />
          A IA gera o resumo automaticamente ao salvar.
        </p>
        <button
          type="submit"
          disabled={busy || recording}
          className="bg-primary-gradient text-on-primary font-semibold px-6 py-2.5 rounded-xl hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <FileText size={16} />
          )}
          {busy ? PHASE_LABEL[phase] : "Salvar e resumir"}
        </button>
      </div>
    </form>
  );
}
