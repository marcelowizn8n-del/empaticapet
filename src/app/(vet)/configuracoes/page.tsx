"use client";

import Card from "@/components/ui/Card";
import { User, Bell, Calendar, Shield } from "lucide-react";

export default function ConfiguracoesVetPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">Configurações</h1>
        <p className="text-on-surface-variant mt-1">Gerencie suas preferências profissionais.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <h3 className="font-headline font-bold">Perfil Profissional</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant">Nome</label>
              <input defaultValue="Dr. Sanctuary" className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant">CRMV</label>
              <input defaultValue="12345-SP" className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant">Especialidade</label>
              <input defaultValue="Clínica Geral" className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" />
            </div>
            <button className="bg-primary-gradient text-on-primary font-semibold py-2.5 px-4 rounded-xl text-sm hover:opacity-95 transition-all">
              Salvar Alterações
            </button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Bell size={20} className="text-primary" />
            </div>
            <h3 className="font-headline font-bold">Notificações</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Novos agendamentos", active: true },
              { label: "Resultados de exames", active: true },
              { label: "Mensagens de tutores", active: false },
              { label: "Alertas do sistema", active: true },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between">
                <span className="text-sm">{n.label}</span>
                <div className={`w-10 h-6 rounded-full relative cursor-pointer ${n.active ? "bg-primary" : "bg-surface-container-high"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${n.active ? "right-1" : "left-1"}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calendar size={20} className="text-primary" />
            </div>
            <h3 className="font-headline font-bold">Horário de Atendimento</h3>
          </div>
          <div className="space-y-3">
            {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map((day) => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-sm w-20">{day}</span>
                <div className="flex items-center gap-2">
                  <input defaultValue="08:00" className="px-3 py-2 bg-surface-container-highest border-none rounded-lg text-sm w-20 focus:ring-2 focus:ring-primary/20" />
                  <span className="text-on-surface-variant">-</span>
                  <input defaultValue="18:00" className="px-3 py-2 bg-surface-container-highest border-none rounded-lg text-sm w-20 focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-primary" />
            </div>
            <h3 className="font-headline font-bold">Segurança</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 bg-surface-container-low rounded-xl text-sm font-medium hover:bg-surface-container-high transition-colors">
              Alterar Senha
            </button>
            <button className="w-full text-left px-4 py-3 bg-surface-container-low rounded-xl text-sm font-medium hover:bg-surface-container-high transition-colors">
              Autenticação de 2 Fatores
            </button>
            <button className="w-full text-left px-4 py-3 bg-surface-container-low rounded-xl text-sm font-medium hover:bg-surface-container-high transition-colors">
              Sessões Ativas
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
