import Link from "next/link";
import { CheckCircle, ArrowRight, PawPrint, Sparkles } from "lucide-react";

export default function PagamentoSucessoPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-success" />
        </div>

        <div className="inline-flex items-center gap-2 bg-success/10 text-success text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
          <Sparkles size={14} />
          Pagamento Aprovado
        </div>

        <h1 className="font-headline text-3xl font-bold text-on-surface mb-3">
          Bem-vindo ao Empática Pet!
        </h1>
        <p className="text-on-surface-variant mb-8">
          Sua assinatura foi ativada com sucesso. Agora você tem acesso a todos os recursos do seu plano.
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/10 mb-8">
          <div className="flex items-center gap-3 justify-center mb-4">
            <PawPrint size={20} className="text-primary" />
            <span className="font-headline font-bold text-primary">Empática Pet</span>
          </div>
          <div className="space-y-2 text-sm text-on-surface-variant">
            <p>Sua assinatura está ativa e pronta para uso.</p>
            <p>Você receberá um e-mail de confirmação em breve.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="bg-primary-gradient text-on-primary font-headline font-bold py-4 px-6 rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
          >
            Ir para o Painel
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/planos"
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Ver detalhes do plano
          </Link>
        </div>
      </div>
    </div>
  );
}
