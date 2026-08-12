import Link from "next/link";
import { XCircle, ArrowRight, RefreshCw } from "lucide-react";

export default function PagamentoFalhaPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-error" />
        </div>

        <h1 className="font-headline text-3xl font-bold text-on-surface mb-3">
          Pagamento não aprovado
        </h1>
        <p className="text-on-surface-variant mb-8">
          Houve um problema ao processar seu pagamento. Verifique os dados do cartão ou tente outro método de pagamento.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/planos"
            className="bg-primary-gradient text-on-primary font-headline font-bold py-4 px-6 rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
          >
            <RefreshCw size={18} />
            Tentar Novamente
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
