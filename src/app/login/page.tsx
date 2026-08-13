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
      console.error("Erro no login Supabase:", error);
      setError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : `Erro no login: ${error.message}`
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
        .maybeSingle();

      const userRole = profile?.role || user.user_metadata?.role;

      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "vet") {
        router.push("/painel");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(`Erro ao conectar com Google: ${error.message}`);
      setLoading(false);
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface-container-lowest px-3 text-on-surface-variant opacity-70">
                  Ou continue com
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-surface-container-highest border border-outline-variant/30 text-on-surface font-headline font-semibold py-3.5 px-6 rounded-xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Entrar com o Google
            </button>

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
