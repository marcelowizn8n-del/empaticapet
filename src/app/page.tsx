import Link from "next/link";
import Image from "next/image";
import { PawPrint, ArrowRight, Heart, Shield, Brain, Calendar, Stethoscope, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <PawPrint size={28} className="text-primary" />
          <span className="font-headline font-bold text-xl text-primary">Empática Pet</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/planos" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            Planos
          </Link>
          <Link href="/login" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="bg-primary-gradient text-on-primary text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-95 transition-all"
          >
            Criar Conta
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-2 mb-8">
          <Heart size={14} className="text-primary" />
          <span className="text-sm font-medium text-primary">The Living Sanctuary</span>
        </div>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-on-surface leading-tight mb-6">
          O refúgio digital para quem você{" "}
          <span className="text-primary">mais ama.</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mb-10">
          Tenha o histórico de saúde do seu pet sempre à mão, com a precisão clínica
          e o carinho que ele merece. Conectamos tutores, veterinários e tecnologia de IA.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/cadastro"
            className="bg-primary-gradient text-on-primary font-headline font-bold py-4 px-8 rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
          >
            Começar Agora
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/cadastro-veterinario"
            className="border-2 border-primary text-primary font-headline font-bold py-4 px-8 rounded-xl hover:bg-primary/5 transition-all"
          >
            Sou Veterinário
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full">
          <div className="bg-lavender-light rounded-2xl p-6 shadow-sm border border-lavender/10 text-left">
            <div className="w-12 h-12 bg-lavender/10 rounded-xl flex items-center justify-center mb-4">
              <Brain size={24} className="text-lavender" />
            </div>
            <h3 className="font-headline font-bold text-lg mb-2">IA Inteligente</h3>
            <p className="text-sm text-on-surface-variant">
              Importação de exames com análise automática via Claude IA para extração precisa de dados clínicos.
            </p>
          </div>
          <div className="bg-coral-light rounded-2xl p-6 shadow-sm border border-coral/10 text-left">
            <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center mb-4">
              <Heart size={24} className="text-coral" />
            </div>
            <h3 className="font-headline font-bold text-lg mb-2">Cuidado Empático</h3>
            <p className="text-sm text-on-surface-variant">
              Interface acolhedora que reduz a ansiedade do tutor com informações claras e acessíveis.
            </p>
          </div>
          <div className="bg-sky-light rounded-2xl p-6 shadow-sm border border-sky/10 text-left">
            <div className="w-12 h-12 bg-sky/10 rounded-xl flex items-center justify-center mb-4">
              <Shield size={24} className="text-sky" />
            </div>
            <h3 className="font-headline font-bold text-lg mb-2">Prontuário Seguro</h3>
            <p className="text-sm text-on-surface-variant">
              Histórico completo e prontuário digital acessível a qualquer momento, com total segurança.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full">
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10 text-center">
            <Stethoscope size={20} className="text-primary mx-auto mb-2" />
            <p className="font-headline text-2xl font-bold text-on-surface">342</p>
            <p className="text-xs text-on-surface-variant">Veterinários</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10 text-center">
            <PawPrint size={20} className="text-coral mx-auto mb-2" />
            <p className="font-headline text-2xl font-bold text-on-surface">1.284</p>
            <p className="text-xs text-on-surface-variant">Pets Cadastrados</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10 text-center">
            <Activity size={20} className="text-lavender mx-auto mb-2" />
            <p className="font-headline text-2xl font-bold text-on-surface">4.502</p>
            <p className="text-xs text-on-surface-variant">Exames com IA</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10 text-center">
            <Calendar size={20} className="text-sky mx-auto mb-2" />
            <p className="font-headline text-2xl font-bold text-on-surface">96%</p>
            <p className="text-xs text-on-surface-variant">Precisão IA</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 flex items-center justify-center gap-3 text-sm text-on-surface-variant">
        <Image src="/logo-tt.svg" alt="Thinking Tools" width={32} height={32} className="opacity-60" />
        <span className="text-[11px] uppercase tracking-widest font-medium opacity-70">&copy;2026 Empática Pet</span>
      </footer>
    </div>
  );
}
