"use client";

import Card from "@/components/ui/Card";
import Link from "next/link";
import { CreditCard, Calendar, CheckCircle, ArrowUpRight, Shield, Sparkles, Receipt } from "lucide-react";

export default function MinhaAssinaturaPage() {
  // Mock data - em produção, viria do banco de dados
  const subscription = {
    plan: "Essencial",
    price: "R$ 19,90",
    status: "Ativa",
    nextBilling: "15 Nov, 2023",
    since: "15 Out, 2023",
    paymentMethod: "Cartão •••• 4589",
    features: [
      "Até 3 pets cadastrados",
      "Importação de exames com IA (5/mês)",
      "Alertas inteligentes de saúde",
      "Histórico completo",
      "Exportação de relatórios PDF",
    ],
    usage: {
      pets: { used: 2, limit: 3 },
      iaImports: { used: 3, limit: 5 },
    },
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">Minha Assinatura</h1>
        <p className="text-on-surface-variant mt-1">Gerencie seu plano e método de pagamento.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-coral">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={18} className="text-coral" />
                  <h2 className="font-headline font-bold text-xl">Plano {subscription.plan}</h2>
                </div>
                <p className="text-sm text-on-surface-variant">Sua assinatura está ativa desde {subscription.since}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-bold px-3 py-1.5 rounded-full">
                <CheckCircle size={12} />
                {subscription.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-surface-container-low rounded-xl p-4">
                <p className="text-[10px] text-on-surface-variant uppercase font-semibold mb-1">Valor Mensal</p>
                <p className="font-headline text-xl font-bold">{subscription.price}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4">
                <p className="text-[10px] text-on-surface-variant uppercase font-semibold mb-1">Próxima Cobrança</p>
                <p className="font-headline text-xl font-bold">{subscription.nextBilling}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4">
                <p className="text-[10px] text-on-surface-variant uppercase font-semibold mb-1">Pagamento</p>
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <CreditCard size={14} className="text-sky" />
                  {subscription.paymentMethod}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/planos"
                className="bg-gradient-to-r from-coral to-coral-dark text-white font-semibold py-2.5 px-5 rounded-xl text-sm hover:opacity-95 transition-all flex items-center gap-2"
              >
                <ArrowUpRight size={16} />
                Fazer Upgrade
              </Link>
              <button className="border border-outline-variant text-on-surface-variant font-medium py-2.5 px-5 rounded-xl text-sm hover:bg-surface-container-high transition-all">
                Alterar Pagamento
              </button>
              <button className="text-sm text-error hover:underline px-4">
                Cancelar
              </button>
            </div>
          </Card>

          {/* Usage */}
          <Card>
            <h3 className="font-headline font-bold mb-4">Uso do Plano</h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Pets cadastrados</span>
                  <span className="text-sm text-on-surface-variant">
                    {subscription.usage.pets.used} de {subscription.usage.pets.limit}
                  </span>
                </div>
                <div className="h-2.5 bg-surface-container-high rounded-full">
                  <div
                    className="h-full bg-sky rounded-full transition-all"
                    style={{ width: `${(subscription.usage.pets.used / subscription.usage.pets.limit) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Importações IA este mês</span>
                  <span className="text-sm text-on-surface-variant">
                    {subscription.usage.iaImports.used} de {subscription.usage.iaImports.limit}
                  </span>
                </div>
                <div className="h-2.5 bg-surface-container-high rounded-full">
                  <div
                    className="h-full bg-lavender rounded-full transition-all"
                    style={{ width: `${(subscription.usage.iaImports.used / subscription.usage.iaImports.limit) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Billing History */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold">Histórico de Cobranças</h3>
              <button className="text-xs text-primary font-semibold hover:underline">Ver todos</button>
            </div>
            <div className="space-y-3">
              {[
                { date: "15 Out, 2023", amount: "R$ 19,90", status: "Pago", method: "Cartão •••• 4589" },
              ].map((bill, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-success/10 rounded-lg flex items-center justify-center">
                      <Receipt size={16} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{bill.date}</p>
                      <p className="text-xs text-on-surface-variant">{bill.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{bill.amount}</p>
                    <span className="text-[10px] text-success font-semibold">{bill.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Plan Features */}
          <Card>
            <h3 className="font-headline font-bold text-sm mb-4">Recursos do Plano</h3>
            <ul className="space-y-2.5">
              {subscription.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <CheckCircle size={14} className="text-coral shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </Card>

          {/* Security */}
          <Card className="bg-sky-light border-sky/10">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-sky shrink-0" />
              <div>
                <h4 className="font-headline font-bold text-sm mb-1">Pagamento Seguro</h4>
                <p className="text-xs text-on-surface-variant">
                  Seus dados financeiros são processados de forma segura pelo Mercado Pago. Não armazenamos dados de cartão.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
