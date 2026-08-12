"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import ICUShiftSummaryCard from "@/components/internacoes/ICUShiftSummaryCard";
import ICUChatFeed from "@/components/internacoes/ICUChatFeed";
import ICUChatInput from "@/components/internacoes/ICUChatInput";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/auth-context";
import type {
  Internacao,
  InternacaoStatus,
  ICUMessage,
  ICUShiftSummary,
} from "@/lib/internacoes";
import type { ShiftSummary } from "@/lib/ai";
import {
  STATUS_META,
  speciesEmoji,
  formatDateTime,
} from "@/lib/internacoes";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Stethoscope,
  Clock,
  MessageSquare,
} from "lucide-react";

export default function InternacaoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const { user, profile } = useAuth();

  const [internacao, setInternacao] = useState<Internacao | null>(null);
  const [messages, setMessages] = useState<ICUMessage[]>([]);
  const [latestSummary, setLatestSummary] = useState<ICUShiftSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [synthesizing, setSynthesizing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Carregar dados iniciais do leito
  const loadRoomData = useCallback(async () => {
    try {
      const { data: internData, error: internError } = await supabase
        .from("internacoes")
        .select("*")
        .eq("id", id)
        .single();

      if (internError || !internData) {
        setError("Internação não encontrada ou erro na conexão.");
        setLoading(false);
        return;
      }

      setInternacao(internData as Internacao);

      // Carregar histórico de mensagens do chat da UTI
      const { data: msgData } = await supabase
        .from("icu_messages")
        .select("*")
        .eq("internacao_id", id)
        .order("created_at", { ascending: true });

      setMessages((msgData as ICUMessage[]) || []);

      // Carregar o último resumo de plantão
      const { data: summaryData } = await supabase
        .from("icu_shift_summaries")
        .select("*")
        .eq("internacao_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (summaryData) {
        setLatestSummary(summaryData as ICUShiftSummary);
      }

      setLoading(false);
    } catch {
      setError("Erro ao carregar dados do leito da UTI.");
      setLoading(false);
    }
  }, [id, supabase]);

  useEffect(() => {
    loadRoomData();

    // Inscrição em tempo real com Supabase Realtime nas novas mensagens
    const channel = supabase
      .channel(`icu_room_${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "icu_messages",
          filter: `internacao_id=eq.${id}`,
        },
        (payload) => {
          const newMsg = payload.new as ICUMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, loadRoomData, supabase]);

  // Enviar mensagem de texto
  const handleSendText = async (text: string) => {
    if (!internacao) return;
    setSendingMsg(true);

    const newMsg = {
      internacao_id: internacao.id,
      author_id: user?.id ?? null,
      author_name: profile?.name || "Profissional UTI",
      message_type: "text" as const,
      content: text,
    };

    const { data: inserted, error: insertError } = await supabase
      .from("icu_messages")
      .insert(newMsg)
      .select()
      .single();

    setSendingMsg(false);

    if (!insertError && inserted) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === inserted.id)) return prev;
        return [...prev, inserted as ICUMessage];
      });
    }
  };

  // Enviar mensagem de áudio (Upload + Transcrição OpenAI)
  const handleSendAudio = async (blob: Blob) => {
    if (!internacao) return;
    setSendingMsg(true);

    try {
      const ext = blob.type.includes("mp4") ? "mp4" : "webm";
      const audioPath = `icu/${internacao.id}/${Date.now()}.${ext}`;

      // 1. Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("plantao-audios")
        .upload(audioPath, blob, { contentType: blob.type || "audio/webm" });

      if (uploadError) throw new Error("Erro no envio do áudio.");

      // Obter URL pública ou caminho
      const { data: urlData } = supabase.storage
        .from("plantao-audios")
        .getPublicUrl(audioPath);

      // 2. Chamada à API de transcrição via OpenAI Whisper
      const audioFile = new File([blob], `audio.${ext}`, {
        type: blob.type || "audio/webm",
      });
      const fd = new FormData();
      fd.append("audio", audioFile);

      const res = await fetch("/api/plantao/transcrever", {
        method: "POST",
        body: fd,
      });

      let transcription = "";
      if (res.ok) {
        const trData = await res.json();
        transcription = trData.transcription || "";
      }

      // 3. Salvar mensagem do tipo 'audio' no Supabase
      const newMsg = {
        internacao_id: internacao.id,
        author_id: user?.id ?? null,
        author_name: profile?.name || "Profissional UTI",
        message_type: "audio" as const,
        content: null,
        audio_url: urlData?.publicUrl || audioPath,
        transcription,
      };

      const { data: inserted, error: insertError } = await supabase
        .from("icu_messages")
        .insert(newMsg)
        .select()
        .single();

      setSendingMsg(false);

      if (!insertError && inserted) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === inserted.id)) return prev;
          return [...prev, inserted as ICUMessage];
        });
      }
    } catch {
      setSendingMsg(false);
      alert("Falha ao enviar mensagem de voz. Tente novamente.");
    }
  };

  // Sintetizar Passagem de Plantão via Claude IA
  const handleSynthesizeSummary = async () => {
    if (!internacao || messages.length === 0) {
      alert("É necessário ter ao menos uma mensagem no chat para sintetizar a passagem de plantão.");
      return;
    }

    setSynthesizing(true);

    try {
      // Compilar todo o texto trocado no chat
      const fullTranscript = messages
        .map((m) => {
          const body = m.content || m.transcription || "[áudio sem transcrição]";
          return `[${m.author_name}]: ${body}`;
        })
        .join("\n\n");

      const res = await fetch("/api/plantao/resumir", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          petName: internacao.pet_name,
          species: internacao.species,
          reason: internacao.reason,
          reportText: fullTranscript,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro na sumarização.");

      const summary = data.summary as ShiftSummary;

      // Salvar o resumo na tabela icu_shift_summaries
      const { data: inserted, error: insertError } = await supabase
        .from("icu_shift_summaries")
        .insert({
          internacao_id: internacao.id,
          generated_by: user?.id ?? null,
          shift_label: "Passagem de Plantão UTI",
          summary_data: summary,
          messages_count: messages.length,
        })
        .select()
        .single();

      setSynthesizing(false);

      if (!insertError && inserted) {
        setLatestSummary(inserted as ICUShiftSummary);
      }
    } catch {
      setSynthesizing(false);
      alert("Não foi possível gerar o resumo. Tente novamente.");
    }
  };

  // Atualizar status do paciente
  const handleStatusChange = async (status: InternacaoStatus) => {
    if (!internacao) return;
    setUpdatingStatus(true);
    const patch: Partial<Internacao> = { status };
    if (status === "alta") patch.discharged_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("internacoes")
      .update(patch)
      .eq("id", internacao.id);

    setUpdatingStatus(false);
    if (!updateError) {
      setInternacao({ ...internacao, ...patch });

      // Registrar mensagem de sistema no chat
      const statusLabel = STATUS_META[status].label;
      await supabase.from("icu_messages").insert({
        internacao_id: internacao.id,
        author_name: "Sistema UTI",
        message_type: "system",
        content: `Status do paciente alterado para: ${statusLabel}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-on-surface-variant">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (error || !internacao) {
    return (
      <div className="space-y-4">
        <Link
          href="/internacoes"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface"
        >
          <ArrowLeft size={16} /> Voltar para internações
        </Link>
        <Card className="bg-error-container/30 border-error/20">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-error shrink-0 mt-0.5" />
            <p className="text-sm text-on-surface-variant">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  const status = STATUS_META[internacao.status];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Breadcrumb */}
      <Link
        href="/internacoes"
        className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface font-medium transition-colors"
      >
        <ArrowLeft size={16} /> Voltar para internações
      </Link>

      {/* Header do paciente */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center text-3xl shrink-0">
              {speciesEmoji(internacao.species)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-headline text-2xl font-bold text-on-surface">
                  {internacao.pet_name}
                </h1>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
                {internacao.box && (
                  <span className="text-xs bg-surface-container-high text-on-surface px-2.5 py-1 rounded-full font-medium">
                    {internacao.box}
                  </span>
                )}
              </div>
              <p className="text-sm text-on-surface-variant mt-1">
                {internacao.breed || "SRD"}
                {internacao.tutor_name
                  ? ` • Tutor: ${internacao.tutor_name}`
                  : ""}
              </p>
              <p className="text-sm text-on-surface-variant mt-1.5 flex items-start gap-1.5">
                <Stethoscope size={15} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  <span className="font-semibold">Motivo da UTI: </span>
                  {internacao.reason}
                </span>
              </p>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
                <Clock size={13} />
                Admitido em {formatDateTime(internacao.admitted_at)}
              </p>
            </div>
          </div>

          <div className="space-y-1 md:text-right">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Status Clínico
            </label>
            <div className="flex items-center gap-2">
              {updatingStatus && (
                <Loader2 size={14} className="animate-spin text-on-surface-variant" />
              )}
              <select
                value={internacao.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as InternacaoStatus)
                }
                disabled={updatingStatus}
                className="px-3 py-2 bg-surface-container-highest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 font-medium"
              >
                <option value="internado">Internado</option>
                <option value="observacao">Em observação</option>
                <option value="critico">Crítico</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Card de Resumo de IA Fixado no Topo */}
      <ICUShiftSummaryCard
        summary={latestSummary}
        onSynthesize={handleSynthesizeSummary}
        synthesizing={synthesizing}
      />

      {/* Chat de UTI por Leito */}
      <Card className="p-0 overflow-hidden border border-outline-variant/15 flex flex-col">
        <div className="p-4 border-b border-outline-variant/15 bg-surface-container-lowest flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            <h2 className="font-headline font-bold text-base text-on-surface">
              Chat ao Vivo do Leito (Passagem de Plantão)
            </h2>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Realtime Ativo
          </span>
        </div>

        {/* Feed de Mensagens */}
        <ICUChatFeed messages={messages} currentUserId={user?.id} />

        {/* Input de Envio de Texto e Gravação de Áudio */}
        <ICUChatInput
          onSendText={handleSendText}
          onSendAudio={handleSendAudio}
          sending={sendingMsg}
        />
      </Card>
    </div>
  );
}
