"use client";

import { useRef, useState } from "react";
import { Mic, Send, Square, Loader2, Paperclip } from "lucide-react";

type Props = {
  onSendText: (text: string) => Promise<void>;
  onSendAudio: (blob: Blob) => Promise<void>;
  sending: boolean;
};

export default function ICUChatInput({
  onSendText,
  onSendAudio,
  sending,
}: Props) {
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        setRecordingTime(0);
        await onSendAudio(blob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      alert("Não foi possível acessar o microfone do navegador.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const content = text.trim();
    setText("");
    await onSendText(content);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-surface-container-lowest border-t border-outline-variant/15 p-3 sm:p-4 rounded-b-2xl">
      {recording ? (
        <div className="flex items-center justify-between bg-error-container/20 border border-error/30 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-error rounded-full animate-ping shrink-0" />
            <div>
              <p className="text-xs font-bold text-error">Gravando mensagem de voz UTI...</p>
              <p className="text-xs text-on-surface-variant font-mono">{formatTimer(recordingTime)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 bg-error text-on-error font-semibold text-xs px-4 py-2 rounded-xl hover:opacity-95 transition-all shadow-sm"
          >
            <Square size={14} /> Enviar Áudio
          </button>
        </div>
      ) : (
        <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
            placeholder="Digite uma atualização do leito ou grave um áudio..."
            className="flex-1 px-4 py-3 bg-surface-container-high border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant/60"
          />

          <button
            type="button"
            onClick={startRecording}
            disabled={sending}
            className="p-3 bg-surface-container-high text-primary hover:bg-primary/10 rounded-xl transition-all disabled:opacity-50"
            title="Gravar áudio de voz"
          >
            <Mic size={20} />
          </button>

          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="bg-primary-gradient text-on-primary p-3 rounded-xl hover:opacity-95 transition-all disabled:opacity-40 flex items-center justify-center shrink-0 shadow-sm"
            title="Enviar mensagem"
          >
            {sending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      )}
    </div>
  );
}
