import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);

export type PlanConfig = {
  name: string;
  price: number;
  userType: "tutor" | "vet";
  description: string;
};

export const plans: Record<string, PlanConfig> = {
  // Tutor
  "tutor-essencial": {
    name: "Essencial (Tutor)",
    price: 19.9,
    userType: "tutor",
    description: "Até 3 pets, importação IA (5/mês), alertas inteligentes",
  },
  "tutor-familia": {
    name: "Família (Tutor)",
    price: 34.9,
    userType: "tutor",
    description: "Pets ilimitados, IA ilimitada, relatórios PDF detalhados",
  },
  // Veterinário
  "vet-starter": {
    name: "Starter (Veterinário)",
    price: 89.9,
    userType: "vet",
    description: "Até 50 pacientes, agenda profissional, prontuário digital",
  },
  "vet-profissional": {
    name: "Profissional (Veterinário)",
    price: 149.9,
    userType: "vet",
    description: "Pacientes ilimitados, IA completa, multi-clínica",
  },
  "vet-clinica": {
    name: "Clínica (Veterinário)",
    price: 299.9,
    userType: "vet",
    description: "Solução completa para clínicas e hospitais",
  },
};
