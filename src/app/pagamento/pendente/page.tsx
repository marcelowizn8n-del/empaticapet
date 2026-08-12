import Link from "next/link";
import { Clock, ArrowRight, Mail } from "lucide-react";

export default function PagamentoPendentePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-amber-light rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={40} className="text-amber" />
        </div>

        <h1 className="font-headline text-3xl font-bold text-on-surface mb-3">
          Pagamento pendente
        </h1>
        <p className="text-on-surface-variant mb-8">
          Seu pagamento está sendo processado. Se você escolheu boleto ou Pix, aguarde a confirmação após o pagamento.
        </p>

        <div className="bg-amber-light rounded-2xl p-5 mb-8 text-left">
          <div className="flex items-start gap-3">
            <Mail size={20} className="text-amber-dark shrink-0 mt-0.5" />
            <p className="text-sm text-amber-dark">
              Você receberá um e-mail assim que o pagamento for confirmado. Sua assinatura será ativada automaticamente.
            </p>
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
            href="/"
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
