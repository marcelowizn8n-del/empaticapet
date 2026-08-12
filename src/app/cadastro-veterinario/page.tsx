"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PawPrint, Eye, ArrowRight, Globe, HelpCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CadastroVeterinarioPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [crmv, setCrmv] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinic, setClinic] = useState("");
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
          role: "vet",
          crmv,
          specialty,
          clinic,
        },
      },
    });

    if (signUpError) {
      setError(
        signUpError.message === "User already registered"
          ? "Este e-mail já está cadastrado."
          : "Erro ao criar conta. Tente novamente."
      );
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        name,
        email,
        role: "vet",
        crmv,
        specialty,
        clinic,
      });

      router.push("/painel");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="p-4 flex items-center justify-between max-w-7xl mx-auto">
        <span className="font-headline font-bold text-primary">Portal do Veterinário</span>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
            <Globe size={20} className="text-on-surface-variant" />
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
            <HelpCircle size={20} className="text-on-surface-variant" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
          {/* Left - Photo */}
          <section className="hidden lg:block relative min-h-[600px]">
            <Image
              src="/hero-pets.png"
              alt="Pets"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
              <h2 className="font-headline text-3xl font-bold leading-tight mb-3">
                Junte-se à nossa rede de cuidado
              </h2>
              <p className="text-white/70 text-sm max-w-sm">
                Simplifique sua rotina clínica e conecte-se com milhares de tutores
                que buscam a melhor assistência para seus pets.
              </p>
            </div>
          </section>

          {/* Right - Form */}
          <section className="p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                Cadastro Profissional
              </div>

              <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Crie sua conta profissional</h3>
              <p className="text-on-surface-variant text-sm mb-8">Preencha os dados abaixo para iniciar sua jornada conosco.</p>

              {error && (
                <div className="mb-5 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant" htmlFor="name">Nome Completo</label>
                  <input
                    className="w-full px-4 py-3.5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 text-sm"
                    id="name"
                    placeholder="Dr. Nome Sobrenome"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant" htmlFor="email-prof">E-mail Profissional</label>
                    <input
                      className="w-full px-4 py-3.5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 text-sm"
                      id="email-prof"
                      placeholder="contato@exemplo.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant" htmlFor="crmv">CRMV</label>
                    <input
                      className="w-full px-4 py-3.5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 text-sm"
                      id="crmv"
                      placeholder="00000-UF"
                      type="text"
                      value={crmv}
                      onChange={(e) => setCrmv(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant" htmlFor="especialidade">Especialidade</label>
                    <select
                      className="w-full px-4 py-3.5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm text-outline-variant"
                      id="especialidade"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="Clínica Geral">Clínica Geral</option>
                      <option value="Cirurgia">Cirurgia</option>
                      <option value="Dermatologia">Dermatologia</option>
                      <option value="Cardiologia">Cardiologia</option>
                      <option value="Ortopedia">Ortopedia</option>
                      <option value="Oftalmologia">Oftalmologia</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant" htmlFor="clinica">Clínica/Hospital</label>
                    <input
                      className="w-full px-4 py-3.5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 text-sm"
                      id="clinica"
                      placeholder="Nome da instituição"
                      type="text"
                      value={clinic}
                      onChange={(e) => setClinic(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant" htmlFor="password-vet">Senha</label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full px-4 py-3.5 pr-12 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant/60 text-sm"
                      id="password-vet"
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

                <div className="flex items-start gap-3 py-2">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 rounded-lg border-outline-variant text-primary focus:ring-primary/20 bg-surface-container-highest"
                    id="terms-vet"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                  />
                  <label className="text-sm text-on-surface-variant leading-tight" htmlFor="terms-vet">
                    Aceito os <a href="#" className="text-primary font-semibold hover:underline">Termos de Uso</a> e a{" "}
                    <a href="#" className="text-primary font-semibold hover:underline">Política de Privacidade</a> da Empática Pet.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-gradient text-on-primary font-headline font-bold py-4 px-6 rounded-xl shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar Minha Conta Profissional
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-on-surface-variant">
                Já possui uma conta?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline">Fazer Login</Link>
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-8 flex items-center justify-center gap-3 py-4">
          <Image src="/logo-tt.svg" alt="Thinking Tools" width={32} height={32} className="opacity-60" />
          <span className="text-[11px] text-on-surface-variant/70 uppercase tracking-widest font-medium">&copy;2026 Empática Pet</span>
        </footer>
      </main>
    </div>
  );
}
