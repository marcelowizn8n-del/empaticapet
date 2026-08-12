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
