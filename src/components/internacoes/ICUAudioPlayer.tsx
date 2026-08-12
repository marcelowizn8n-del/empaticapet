"use client";

import { useState } from "react";
import { Mic, ChevronDown, ChevronUp, FileText } from "lucide-react";

type Props = {
  audioUrl?: string | null;
  transcription?: string | null;
};

export default function ICUAudioPlayer({ audioUrl, transcription }: Props) {
  const [showTranscription, setShowTranscription] = useState(true);

  return (
    <div className="space-y-2 max-w-md">
      {/* Visual Audio Player */}
      {audioUrl && (
        <div className="flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-xs rounded-xl p-2 border border-outline-variant/10 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Mic size={16} />
          </div>
          <audio controls src={audioUrl} className="h-8 flex-1 max-w-xs text-xs" />
        </div>
      )}

      {/* Transcrição da IA */}
      {transcription && (
        <div className="bg-surface-container-lowest/60 rounded-xl p-3 border border-outline-variant/15 space-y-1">
          <button
            type="button"
            onClick={() => setShowTranscription(!showTranscription)}
            className="flex items-center justify-between w-full text-[11px] font-bold text-primary uppercase tracking-wider hover:opacity-80 transition-opacity"
          >
            <span className="flex items-center gap-1.5">
              <FileText size={13} />
              Transcrição IA (Whisper)
            </span>
            {showTranscription ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showTranscription && (
            <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap pt-1 border-t border-outline-variant/10">
              "{transcription}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
