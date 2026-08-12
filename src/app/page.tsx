import Link from "next/link";
import Image from "next/image";
import {
  PawPrint,
  ArrowRight,
  Heart,
  Shield,
  Brain,
  Calendar,
  Stethoscope,
  Activity,
  CheckCircle2,
  BedDouble,
  UserCheck,
  Star,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Header */}
      <header className="bg-warm-hero sticky top-0 z-50 transition-all border-b border-amber-900/5 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
              <PawPrint size={22} />
            </div>
            <div>
              <span className="font-headline font-bold text-xl text-on-surface tracking-tight block leading-tight">
                Empática<span className="text-primary">Pet</span>
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium tracking-widest uppercase block -mt-1">
                Pet Care & AI
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            <Link href="/" className="text-primary font-bold hover:text-primary transition-colors">
              Início
            </Link>
            <Link href="#servicos" className="hover:text-primary transition-colors">
              Serviços
            </Link>
            <Link href="#sobre" className="hover:text-primary transition-colors">
              Sobre Nós
            </Link>
            <Link href="/planos" className="hover:text-primary transition-colors">
              Planos
            </Link>
            <Link href="/manual" className="hover:text-primary transition-colors">
              Manual
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-on-surface hover:text-primary px-4 py-2 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="bg-primary text-on-primary text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-primary-dark transition-all shadow-sm hover:shadow-md"
            >
              Fazer Cadastro
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-warm-hero relative overflow-hidden pt-6 pb-20 md:pb-28">
        {/* Floating Doodles */}
        <div className="absolute top-12 left-10 text-amber-800/15 pointer-events-none select-none">
          <PawPrint size={48} className="rotate-[-20deg]" />
        </div>
        <div className="absolute bottom-20 left-1/3 text-amber-800/10 pointer-events-none select-none">
          <PawPrint size={64} className="rotate-[15deg]" />
        </div>
        <div className="absolute top-20 right-12 text-amber-800/15 pointer-events-none select-none">
          <SparklesIcon />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2">
              <span className="font-script text-3xl md:text-4xl text-amber-800 font-bold">
                Bem-vindo ao Empática Pet
              </span>
              <SparklesIcon className="w-5 h-5 text-amber-700 opacity-70" />
            </div>

            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface leading-[1.15] tracking-tight">
              O <span className="text-primary underline decoration-primary/30 underline-offset-8">melhor cuidado</span> para o seu melhor amigo.
            </h1>

            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Tenha o histórico médico do seu pet sempre à mão com precisão clínica e carinho.
              Conectamos tutores, veterinários e Inteligência Artificial para exames e UTI em uma experiência leve e empática.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/cadastro"
                className="bg-primary text-on-primary font-headline font-bold py-4 px-8 rounded-full shadow-md hover:bg-primary-dark hover:shadow-lg transition-all flex items-center justify-center gap-3 group text-base"
              >
                Conhecer Nossos Serviços
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/cadastro-veterinario"
                className="bg-surface-container-lowest border-2 border-primary text-primary font-headline font-bold py-4 px-8 rounded-full hover:bg-primary/5 transition-all text-center text-base shadow-2xs"
              >
                Sou Veterinário
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-amber-900/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-primary shrink-0" />
                <span className="text-xs font-semibold text-on-surface-variant">Exames via IA</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-primary shrink-0" />
                <span className="text-xs font-semibold text-on-surface-variant">Chat de UTI ao Vivo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-primary shrink-0" />
                <span className="text-xs font-semibold text-on-surface-variant">Prontuário Único</span>
              </div>
            </div>
          </div>

          {/* Right Column - Organic Circle Frame with Dog & Cat Image */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[440px] lg:h-[440px]">
              {/* Outer Decorative Circle Ring */}
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow" />

              {/* Main Circular Image Frame */}
              <div className="w-full h-full rounded-full overflow-hidden border-8 border-surface-container-lowest shadow-2xl relative z-10">
                <Image
                  src="/hero-dog-cat-human.png"
                  alt="Cachorro, Gato e Tutor felizes no Empática Pet"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>

              {/* Cute Floating Badges */}
              <div className="absolute -bottom-4 -left-4 bg-surface-container-lowest border border-amber-900/10 rounded-2xl p-3 shadow-lg flex items-center gap-3 z-20">
                <div className="w-10 h-10 bg-coral-light rounded-xl flex items-center justify-center text-coral">
                  <Heart size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Cuidado Acolhedor</p>
                  <p className="text-[10px] text-on-surface-variant">100% Empatia Pet</p>
                </div>
              </div>

              <div className="absolute top-4 -right-4 bg-surface-container-lowest border border-amber-900/10 rounded-2xl p-3 shadow-lg flex items-center gap-3 z-20">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Brain size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Claude IA Integrado</p>
                  <p className="text-[10px] text-on-surface-variant">Análise Clínica</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organic Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10">
          <svg
            className="relative block w-full h-12 md:h-16 text-background"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Services / Pastel Cards Section */}
      <section id="servicos" className="py-16 md:py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div>
            <span className="font-script text-3xl text-amber-800 font-bold block mb-1">
              Nossos Serviços
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface">
              Tudo o que seu Pet Precisa em Um Só Lugar
            </h2>
            <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto mt-2">
              Desenvolvido com o conceito "The Living Sanctuary" para oferecer precisão médica e tranquilidade para a família.
            </p>
          </div>

          {/* 4 Pastel Circle Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 1. Cães */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-28 h-28 rounded-full bg-coral-light flex items-center justify-center text-coral mb-6 group-hover:scale-110 transition-transform">
                <span className="text-5xl">🐕</span>
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface mb-2">
                Cuidado Canino
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Perfil vital completo, controle de peso, histórico de vacinas e lembretes inteligentes de consultas.
              </p>
              <Link
                href="/cadastro"
                className="mt-auto text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Cadastrar Cão <ArrowRight size={14} />
              </Link>
            </div>

            {/* 2. Gatos */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-28 h-28 rounded-full bg-lavender-light flex items-center justify-center text-lavender mb-6 group-hover:scale-110 transition-transform">
                <span className="text-5xl">🐈</span>
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface mb-2">
                Cuidado Felino
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Prontuário dedicado a gatos com monitoramento de exames periódicos e especificidades clínicas.
              </p>
              <Link
                href="/cadastro"
                className="mt-auto text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Cadastrar Gato <ArrowRight size={14} />
              </Link>
            </div>

            {/* 3. Exames por IA */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-28 h-28 rounded-full bg-amber-light flex items-center justify-center text-amber-dark mb-6 group-hover:scale-110 transition-transform">
                <Brain size={44} />
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface mb-2">
                Exames por IA
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Upload de PDFs e fotos de exames com OCR e extração automática de laudos via Claude 3.5 Sonnet.
              </p>
              <Link
                href="/importar-exames"
                className="mt-auto text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Testar IA de Exames <ArrowRight size={14} />
              </Link>
            </div>

            {/* 4. UTI & Plantão */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-28 h-28 rounded-full bg-teal-light flex items-center justify-center text-teal-dark mb-6 group-hover:scale-110 transition-transform">
                <BedDouble size={44} />
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface mb-2">
                UTI & Plantão
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                Chat ao vivo por leito de UTI com gravação de áudio, transcrição OpenAI Whisper e resumos por turno.
              </p>
              <Link
                href="/internacoes"
                className="mt-auto text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Ver Módulo de UTI <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div>
            <Link
              href="/planos"
              className="inline-flex items-center gap-2 bg-primary text-on-primary text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-primary-dark transition-all shadow-sm"
            >
              Ver Todos os Planos e Serviços
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Us / Arch Frame Section */}
      <section id="sobre" className="py-16 md:py-24 bg-surface-container-low/60 border-y border-outline-variant/15 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Arch Frame Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-96 sm:w-80 sm:h-[440px] rounded-t-full overflow-hidden border-8 border-surface-container-lowest shadow-2xl">
              <Image
                src="/about-vet-dog.png"
                alt="Veterinária carinhosa com cãozinho"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right Column - Text & Feature Checklist */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="font-script text-3xl text-amber-800 font-bold block">
              Sobre Nós
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface leading-tight">
              Nossa Jornada pelo Cuidado Pet: Uma Paixão pela Saúde Animal
            </h2>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              O Empática Pet nasceu da necessidade de transformar a gestão veterinária e o acompanhamento dos tutores em uma experiência transparente, empática e conectada pelas tecnologias mais avançadas de IA.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  🐾
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Mais de 300 Vets</p>
                  <p className="text-xs text-on-surface-variant">Clínicas e hospitais parceiros</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  🐾
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">IA de Extração em Segundos</p>
                  <p className="text-xs text-on-surface-variant">Sem digitação manual de laudos</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  🐾
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Bloqueio de Duplicatas</p>
                  <p className="text-xs text-on-surface-variant">Segurança total por hash de arquivo</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  🐾
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Central de Comando UTI</p>
                  <p className="text-xs text-on-surface-variant">Visão panorâmica para a diretoria</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/cadastro"
                className="bg-primary text-on-primary font-headline font-bold py-3.5 px-8 rounded-full shadow-sm hover:bg-primary-dark transition-all inline-flex items-center gap-2 text-sm"
              >
                Conhecer a Plataforma
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar / Trust Banner */}
      <section className="bg-warm-hero py-16 border-b border-amber-900/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="font-script text-3xl text-amber-800 font-bold block">
              Por que Escolher o Empática Pet
            </span>
            <h2 className="font-headline text-3xl font-extrabold text-on-surface">
              Seus Pets Ficarão Extremamente Felizes Conosco
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-amber-900/10 shadow-xs">
              <Stethoscope size={28} className="text-primary mx-auto mb-2" />
              <p className="font-headline text-3xl font-extrabold text-on-surface">342+</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Veterinários Conectados</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-amber-900/10 shadow-xs">
              <PawPrint size={28} className="text-coral mx-auto mb-2" />
              <p className="font-headline text-3xl font-extrabold text-on-surface">1.284+</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Pets Cadastrados</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-amber-900/10 shadow-xs">
              <Activity size={28} className="text-lavender mx-auto mb-2" />
              <p className="font-headline text-3xl font-extrabold text-on-surface">4.502+</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Exames Processados</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-amber-900/10 shadow-xs">
              <Star size={28} className="text-amber-dark mx-auto mb-2 fill-amber-dark" />
              <p className="font-headline text-3xl font-extrabold text-on-surface">96%</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Precisão do Modelo IA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest py-12 border-t border-outline-variant/15 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary">
              <PawPrint size={18} />
            </div>
            <span className="font-headline font-bold text-base text-on-surface">
              Empática<span className="text-primary">Pet</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-on-surface-variant font-medium">
            <Link href="/planos" className="hover:text-primary transition-colors">Planos</Link>
            <Link href="/cadastro-veterinario" className="hover:text-primary transition-colors">Área do Veterinário</Link>
            <Link href="/manual" className="hover:text-primary transition-colors">Manual de Uso</Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-on-surface-variant opacity-70">
            <Image src="/logo-tt.svg" alt="Thinking Tools" width={24} height={24} className="opacity-60" />
            <span>&copy; 2026 Empática Pet. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6 text-amber-700"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}
