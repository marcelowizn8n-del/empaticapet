import { NextRequest, NextResponse } from "next/server";
import { preferenceClient } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planName, planPrice, userType } = body;

    if (!planName || !planPrice || !userType) {
      return NextResponse.json(
        { error: "Dados do plano incompletos" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3008";

    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: `paws-pulse-${userType}-${planName.toLowerCase().replace(/\s+/g, "-")}`,
            title: `Empática Pet - Plano ${planName}`,
            description: `Assinatura mensal do plano ${planName} para ${userType === "tutor" ? "Tutores" : "Veterinários"}`,
            quantity: 1,
            currency_id: "BRL",
            unit_price: planPrice,
          },
        ],
        back_urls: {
          success: `${appUrl}/pagamento/sucesso`,
          failure: `${appUrl}/pagamento/falha`,
          pending: `${appUrl}/pagamento/pendente`,
        },
        auto_return: "approved",
        notification_url: `${appUrl}/api/mercadopago/webhook`,
        statement_descriptor: "PAWS&PULSE",
        external_reference: JSON.stringify({
          planName,
          userType,
          timestamp: Date.now(),
        }),
      },
    });

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error: any) {
    console.error("Erro ao criar preferência MP:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento", details: error.message },
      { status: 500 }
    );
  }
}
