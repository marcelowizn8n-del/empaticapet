"use client";

import { useEffect, useRef } from "react";
import type { ICUMessage } from "@/lib/internacoes";
import { formatTimeOnly } from "@/lib/internacoes";
import ICUAudioPlayer from "./ICUAudioPlayer";
import { Info, UserCheck } from "lucide-react";

type Props = {
  messages: ICUMessage[];
  currentUserId?: string | null;
};

export default function ICUChatFeed({ messages, currentUserId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-on-surface-variant space-y-2">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
          <UserCheck size={24} />
        </div>
        <p className="font-headline font-bold text-sm text-on-surface">
          Nenhuma mensagem no chat deste leito
        </p>
        <p className="text-xs max-w-xs">
          Envie uma mensagem de texto ou grave um áudio para registrar evoluções, exames e medicações no plantão.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 max-h-[500px] overflow-y-auto scrollbar-thin">
      {messages.map((msg) => {
        const isMine = currentUserId && msg.author_id === currentUserId;
        const isSystem = msg.message_type === "system";

        if (isSystem) {
          return (
            <div key={msg.id} className="flex justify-center my-2">
              <div className="bg-surface-container-high/60 backdrop-blur-xs px-3 py-1.5 rounded-full text-[11px] text-on-surface-variant flex items-center gap-1.5 border border-outline-variant/10">
                <Info size={13} className="text-primary" />
                <span>{msg.content}</span>
                <span className="opacity-60">• {formatTimeOnly(msg.created_at)}</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
          >
            {/* Nome do Autor e Horário */}
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[11px] font-bold text-on-surface-variant">
                {isMine ? "Você" : msg.author_name}
              </span>
              <span className="text-[10px] text-on-surface-variant/60">
                {formatTimeOnly(msg.created_at)}
              </span>
            </div>

            {/* Bolha da Mensagem */}
            <div
              className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-2xs space-y-2 ${
                isMine
                  ? "bg-primary text-on-primary rounded-tr-xs"
                  : "bg-surface-container-high text-on-surface rounded-tl-xs border border-outline-variant/10"
              }`}
            >
              {/* Mensagem de Texto */}
              {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}

              {/* Mensagem de Áudio / Transcrição */}
              {msg.message_type === "audio" && (
                <ICUAudioPlayer
                  audioUrl={msg.audio_url}
                  transcription={msg.transcription}
                />
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
