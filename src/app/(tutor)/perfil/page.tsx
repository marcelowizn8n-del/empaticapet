"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/supabase/auth-context";
import { createClient } from "@/lib/supabase/client";
import { User, Mail, Phone, Camera, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PerfilPage() {
  const { profile, user } = useAuth();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Sync state when profile loads
  useState(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage("Erro ao enviar foto. Tente novamente.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        phone,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Profile update error:", error);
      setMessage("Erro ao salvar. Tente novamente.");
    } else {
      setMessage("Perfil atualizado com sucesso!");
    }

    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
          <ArrowLeft size={20} className="text-on-surface-variant" />
        </Link>
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Meu Perfil</h1>
          <p className="text-sm text-on-surface-variant">Edite suas informações pessoais</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/10">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-on-surface-variant" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all"
            >
              {uploading ? (
                <Loader2 size={16} className="text-on-primary animate-spin" />
              ) : (
                <Camera size={16} className="text-on-primary" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <p className="text-xs text-on-surface-variant mt-3">Clique na camera para trocar a foto</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="name">
              Nome Completo
            </label>
            <div className="relative flex items-center">
              <User size={18} className="absolute left-4 text-outline-variant" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="email">
              E-mail
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-4 text-outline-variant" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl text-sm text-on-surface-variant cursor-not-allowed"
                id="email"
                type="email"
                value={profile?.email || ""}
                disabled
              />
            </div>
            <p className="text-xs text-on-surface-variant px-1">O e-mail não pode ser alterado</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="phone">
              Telefone
            </label>
            <div className="relative flex items-center">
              <Phone size={18} className="absolute left-4 text-outline-variant" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${
              message.includes("sucesso")
                ? "bg-success/10 border border-success/20 text-success"
                : "bg-error/10 border border-error/20 text-error"
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary-gradient text-on-primary font-headline font-bold py-4 px-6 rounded-xl shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                Salvar Alterações
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
