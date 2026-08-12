"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PawPrint, Mail, Lock, Eye, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : "Erro ao fazer login. Tente novamente."
      );
      setLoading(false);
      return;
    }

    // Get user profile to redirect to correct dashboard
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "vet") {
        router.push("/painel");
      } else if (profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        {/* Left - Photo */}
        <section className="hidden lg:block relative min-h-[600px]">
          <Image
            src="/hero-dog-cat-human.png"
            alt="Pets"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
            <div className="flex items-center gap-2 mb-4">
              <PawPrint size={24} className="text-white" />
              <span className="font-headline font-bold text-lg">Empática Pet</span>
            </div>
            <h2 className="font-headline text-3xl font-bold leading-tight mb-2">
              O refúgio digital para quem você mais ama.
            </h2>
            <p className="text-white/70 text-sm">
              Cuidado empático com tecnologia de ponta.
            </p>
          </div>
        </section>

        {/* Right - Form */}
        <section className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
              <PawPrint size={24} className="text-primary" />
              <h1 className="font-headline font-bold text-xl text-primary">Empática Pet</h1>
            </div>

            <div className="mb-8">
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Bem-vindo de volta</h2>
              <p className="text-on-surface-variant text-sm">Entre para acessar o Living Sanctuary.</p>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="email">
                  E-mail
                </label>
                <div className="relative flex items-center">
                  <Mail size={18} className="absolute left-4 text-outline-variant" />
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 text-sm"
                    id="email"
                    name="email"
                    placeholder="seu@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="password">
                  Senha
                </label>
                <div className="relative flex items-center">
                  <Lock size={18} className="absolute left-4 text-outline-variant" />
                  <input
                    className="w-full pl-12 pr-12 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 text-sm"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-outline-variant hover:text-primary transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-on-surface-variant">
                  <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary/20" />
                  Lembrar de mim
                </label>
                <a href="#" className="text-primary font-semibold hover:underline">
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-gradient text-on-primary font-headline font-bold py-4 px-6 rounded-xl shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-2">
              <p className="text-on-surface-variant text-sm">
                Não tem conta?{" "}
                <Link href="/cadastro" className="text-primary font-bold hover:underline">
                  Criar Conta
                </Link>
              </p>
              <p className="text-on-surface-variant text-sm">
                É veterinário?{" "}
                <Link href="/cadastro-veterinario" className="text-primary font-bold hover:underline">
                  Cadastro Profissional
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
