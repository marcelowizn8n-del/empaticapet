"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PawPrint, User, Mail, Phone, Lock, Eye, ArrowRight, Star, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      setError("Você precisa aceitar os termos de uso.");
      return;
    }
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role: "tutor",
        },
      },
    });

    if (signUpError) {
      console.error("Erro no cadastro Supabase:", signUpError);
      setError(
        signUpError.message === "User already registered" || signUpError.message?.includes("already registered")
          ? "Este e-mail já está cadastrado. Tente fazer o login."
          : `Erro no cadastro: ${signUpError.message}`
      );
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create profile
      await supabase.from("profiles").upsert({
        id: data.user.id,
        name,
        email,
        phone,
        role: "tutor",
      });

      router.push("/dashboard");
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
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
        {/* Left - Welcome */}
        <section className="hidden lg:flex flex-col justify-between p-12 bg-surface-container-low relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/20 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-fixed/20 rounded-full -ml-24 -mb-24" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <PawPrint size={28} className="text-primary" />
              <h1 className="font-headline font-extrabold text-2xl text-primary tracking-tight">Empática Pet</h1>
            </div>
            <div className="space-y-6">
              <h2 className="font-headline text-5xl font-bold text-on-surface leading-tight">
                Um refúgio digital para quem você <span className="text-primary">mais ama.</span>
              </h2>
              <p className="text-on-surface-variant text-lg max-w-md">
                Junte-se à nossa comunidade e tenha o histórico de saúde do seu pet sempre à mão,
                com a precisão clínica e o carinho que ele merece.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 rounded-2xl overflow-hidden shadow-lg aspect-video flex items-end p-6 border border-outline-variant/20">
            <Image
              src="/hero-dog-cat-human.png"
              alt="Depoimento Empática Pet"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 text-white">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-warning text-warning" />
                ))}
              </div>
              <p className="font-medium italic text-sm">&ldquo;A melhor experiência de cuidado digital.&rdquo;</p>
            </div>
          </div>
        </section>

        {/* Right - Form */}
        <section className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <PawPrint size={24} className="text-primary" />
              <h1 className="font-headline font-bold text-xl text-primary">Empática Pet</h1>
            </div>

            <div className="mb-10">
              <h3 className="font-headline text-3xl font-bold text-on-surface mb-2">Criar conta</h3>
              <p className="text-on-surface-variant">Comece sua jornada no Living Sanctuary hoje mesmo.</p>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="name">Nome Completo</label>
                <div className="relative flex items-center">
                  <User size={18} className="absolute left-4 text-outline-variant" />
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 text-sm"
                    id="name"
                    placeholder="Ex: Ana Silva"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="email">E-mail</label>
                <div className="relative flex items-center">
                  <Mail size={18} className="absolute left-4 text-outline-variant" />
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 text-sm"
                    id="email"
                    placeholder="seu@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="phone">Telefone</label>
                  <div className="relative flex items-center">
                    <Phone size={18} className="absolute left-4 text-outline-variant" />
                    <input
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 text-sm"
                      id="phone"
                      placeholder="(11) 99999-9999"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="password">Senha</label>
                  <div className="relative flex items-center">
                    <Lock size={18} className="absolute left-4 text-outline-variant" />
                    <input
                      className="w-full pl-12 pr-12 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 text-sm"
                      id="password"
                      placeholder="Mínimo 6 caracteres"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-outline-variant hover:text-primary transition-colors">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 px-1 py-2">
                <input
                  type="checkbox"
                  className="mt-0.5 h-5 w-5 rounded-lg border-outline-variant text-primary focus:ring-primary/20 bg-surface-container-highest"
                  id="terms"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <label className="text-sm text-on-surface-variant leading-tight" htmlFor="terms">
                  Eu aceito os <a href="#" className="text-primary font-semibold hover:underline">Termos de Uso</a> e a{" "}
                  <a href="#" className="text-primary font-semibold hover:underline">Política de Privacidade</a>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-gradient text-on-primary font-headline font-bold py-5 px-6 rounded-xl shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    Criar Minha Conta
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
                  Ou cadastrar com
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
              Cadastrar com o Google
            </button>

            <div className="mt-10 text-center">
              <p className="text-on-surface-variant">
                Já possui uma conta?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline">Fazer Login</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
