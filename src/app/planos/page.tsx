"use client";

import Link from "next/link";
import { PawPrint, Check, ArrowRight, Sparkles, Building2, Stethoscope, Heart, Crown, Zap } from "lucide-react";
import { useState } from "react";

const tutorPlans = [
  {
    name: "Gratuito",
    price: "0",
    period: "para sempre",
    description: "Comece a cuidar do seu pet agora",
    icon: <Heart size={24} />,
    color: "text-primary",
    bgIcon: "bg-primary/10",
    features: [
      "1 pet cadastrado",
      "Histórico básico de saúde",
      "Agendamentos manuais",
      "Perfil do pet",
    ],
    cta: "Começar Grátis",
    ctaStyle: "border-2 border-primary text-primary hover:bg-primary/5",
    popular: false,
  },
  {
    name: "Essencial",
    price: "19,90",
    period: "/mês",
    description: "Para quem tem mais de um companheiro",
    icon: <Sparkles size={24} />,
    color: "text-coral",
    bgIcon: "bg-coral-light",
    features: [
      "Até 3 pets cadastrados",
      "Importação de exames com IA (5/mês)",
      "Alertas inteligentes de saúde",
      "Histórico completo",
      "Exportação de relatórios PDF",
      "Suporte por e-mail",
    ],
    cta: "Assinar Essencial",
    ctaStyle: "bg-gradient-to-r from-coral to-coral-dark text-white hover:opacity-95",
    popular: true,
  },
  {
    name: "Família",
    price: "34,90",
    period: "/mês",
    description: "Cuidado completo para toda a família pet",
    icon: <Crown size={24} />,
    color: "text-lavender",
    bgIcon: "bg-lavender-light",
    features: [
      "Pets ilimitados",
      "Importação de exames com IA ilimitada",
      "Alertas e lembretes avançados",
      "Relatórios PDF detalhados",
      "Tendências de saúde e gráficos",
      "Compartilhamento com veterinário",
      "Suporte prioritário",
    ],
    cta: "Assinar Família",
    ctaStyle: "bg-gradient-to-r from-lavender to-lavender-dark text-white hover:opacity-95",
    popular: false,
  },
];

const vetPlans = [
  {
    name: "Starter",
    price: "89,90",
    period: "/mês",
    description: "Ideal para consultórios individuais",
    icon: <Stethoscope size={24} />,
    color: "text-sky",
    bgIcon: "bg-sky-light",
    features: [
      "Até 50 pacientes ativos",
      "Agenda profissional",
      "Prontuário digital básico",
      "Importação IA (20 exames/mês)",
      "1 usuário veterinário",
      "Suporte por e-mail",
    ],
    cta: "Assinar Starter",
    ctaStyle: "border-2 border-sky text-sky hover:bg-sky/5",
    popular: false,
  },
  {
    name: "Profissional",
    price: "149,90",
    period: "/mês",
    description: "Para profissionais que querem escalar",
    icon: <Zap size={24} />,
    color: "text-amber",
    bgIcon: "bg-amber-light",
    features: [
      "Pacientes ilimitados",
      "Importação IA ilimitada",
      "Prontuário completo com prescrições",
      "Agenda colorida por tipo",
      "Multi-clínica (até 3)",
      "Relatórios gerenciais",
      "Dashboard de tendências",
      "Suporte prioritário",
    ],
    cta: "Assinar Profissional",
    ctaStyle: "bg-gradient-to-r from-amber to-amber-dark text-white hover:opacity-95",
    popular: true,
  },
  {
    name: "Clínica",
    price: "299,90",
    period: "/mês",
    description: "Solução completa para clínicas e hospitais",
    icon: <Building2 size={24} />,
    color: "text-primary",
    bgIcon: "bg-primary/10",
    features: [
      "Tudo do Profissional",
      "Veterinários ilimitados",
      "Clínicas ilimitadas",
      "API para integrações",
      "Monitoramento de IA avançado",
      "Gestão de equipe e permissões",
      "Backup dedicado",
      "Gerente de conta dedicado",
      "SLA garantido",
    ],
    cta: "Assinar Clínica",
    ctaStyle: "bg-primary-gradient text-white hover:opacity-95",
    popular: false,
  },
];

type PlanCardProps = {
  plan: typeof tutorPlans[0];
  userType: string;
};

function PlanCard({ plan, userType }: PlanCardProps) {
  const handleSubscribe = async () => {
    if (plan.price === "0") {
      window.location.href = "/cadastro";
      return;
    }

    try {
      const res = await fetch("/api/mercadopago/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: plan.name,
          planPrice: parseFloat(plan.price.replace(",", ".")),
          userType,
        }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (err) {
      console.error("Erro ao criar preferência:", err);
    }
  };

  return (
    <div className={`relative bg-white rounded-2xl p-6 shadow-sm border ${plan.popular ? "border-2 border-primary shadow-md" : "border-outline-variant/10"} flex flex-col`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary-gradient text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">
            Mais Popular
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-11 h-11 ${plan.bgIcon} rounded-xl flex items-center justify-center ${plan.color}`}>
          {plan.icon}
        </div>
        <div>
          <h3 className="font-headline font-bold text-lg">{plan.name}</h3>
          <p className="text-xs text-on-surface-variant">{plan.description}</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-on-surface-variant">R$</span>
          <span className="font-headline text-4xl font-bold text-on-surface">{plan.price}</span>
          <span className="text-sm text-on-surface-variant">{plan.period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-on-surface-variant">
            <Check size={16} className={`${plan.color} shrink-0 mt-0.5`} />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        className={`w-full font-headline font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group ${plan.ctaStyle}`}
      >
        {plan.cta}
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

export default function PlanosPage() {
  const [tab, setTab] = useState<"tutor" | "vet">("tutor");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <PawPrint size={28} className="text-primary" />
          <span className="font-headline font-bold text-xl text-primary">Empática Pet</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            Entrar
          </Link>
          <Link href="/cadastro" className="bg-primary-gradient text-on-primary text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-95 transition-all">
            Criar Conta
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mb-4">
            Escolha o plano ideal para{" "}
            <span className="text-primary">seu santuário</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Planos flexíveis para tutores e veterinários. Comece grátis e evolua conforme sua necessidade.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-surface-container-high rounded-2xl p-1.5 flex gap-1">
            <button
              onClick={() => setTab("tutor")}
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
                tab === "tutor"
                  ? "bg-white text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="flex items-center gap-2">
                <PawPrint size={16} /> Para Tutores
              </span>
            </button>
            <button
              onClick={() => setTab("vet")}
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
                tab === "vet"
                  ? "bg-white text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="flex items-center gap-2">
                <Stethoscope size={16} /> Para Veterinários
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(tab === "tutor" ? tutorPlans : vetPlans).map((plan) => (
            <PlanCard key={plan.name} plan={plan} userType={tab} />
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-16 text-center">
          <p className="text-sm text-on-surface-variant mb-6">Pagamento seguro processado por</p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 bg-sky-light px-5 py-3 rounded-xl">
              <span className="font-headline font-bold text-sky-dark text-sm">Mercado Pago</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Check size={16} className="text-success" />
              <span className="text-xs font-medium">SSL Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Check size={16} className="text-success" />
              <span className="text-xs font-medium">Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Check size={16} className="text-success" />
              <span className="text-xs font-medium">7 dias grátis</span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="font-headline text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "Posso testar antes de assinar?", a: "Sim! O plano Gratuito para tutores é permanente, e todos os planos pagos oferecem 7 dias de teste grátis." },
              { q: "Como funciona a importação de exames com IA?", a: "Basta fazer upload de um PDF ou foto do exame. Nossa IA (Claude) extrai automaticamente os dados clínicos para o prontuário digital." },
              { q: "Posso trocar de plano a qualquer momento?", a: "Sim, você pode fazer upgrade ou downgrade a qualquer momento. O valor é ajustado proporcionalmente." },
              { q: "Quais formas de pagamento são aceitas?", a: "Aceitamos cartão de crédito, débito, boleto e Pix através do Mercado Pago." },
              { q: "Como cancelo minha assinatura?", a: "Você pode cancelar diretamente no painel de gerenciamento da sua conta, sem burocracia." },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-2xl border border-outline-variant/10 shadow-sm group">
                <summary className="p-5 cursor-pointer font-headline font-semibold text-on-surface flex items-center justify-between list-none">
                  {faq.q}
                  <span className="text-on-surface-variant text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-on-surface-variant">
        &copy; 2024 Empática Pet. Todos os direitos reservados.
      </footer>
    </div>
  );
}
