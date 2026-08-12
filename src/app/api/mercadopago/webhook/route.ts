import { NextRequest, NextResponse } from "next/server";
import { paymentClient } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // O Mercado Pago envia notificações com type e data.id
    if (body.type === "payment") {
      const paymentId = body.data?.id;

      if (paymentId) {
        const payment = await paymentClient.get({ id: paymentId });

        const status = payment.status; // approved, pending, rejected
        const externalReference = payment.external_reference;
        const payerEmail = payment.payer?.email;
        const amount = payment.transaction_amount;

        console.log("=== WEBHOOK MERCADO PAGO ===");
        console.log("Payment ID:", paymentId);
        console.log("Status:", status);
        console.log("Valor:", amount);
        console.log("Payer:", payerEmail);
        console.log("Referência:", externalReference);

        // TODO: Aqui você deve:
        // 1. Buscar o usuário pelo e-mail ou referência externa
        // 2. Atualizar o plano/assinatura no banco de dados
        // 3. Ativar/desativar features conforme o plano

        if (status === "approved") {
          // Ativar assinatura do usuário
          console.log("✓ Pagamento aprovado! Ativar assinatura.");
        } else if (status === "rejected") {
          console.log("✗ Pagamento rejeitado.");
        } else if (status === "pending") {
          console.log("⏳ Pagamento pendente (boleto/pix).");
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Erro no webhook MP:", error);
    // Retornar 200 mesmo em caso de erro para o MP não reenviar
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
