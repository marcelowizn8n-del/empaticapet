"use client";

import Card from "@/components/ui/Card";
import { Shield, Database, Bell, AlertTriangle, Server, HardDrive, Mail, Smartphone, Activity } from "lucide-react";

export default function ConfiguracoesGlobaisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">Configurações Globais</h1>
        <p className="text-on-surface-variant mt-1">
          Gerencie os parâmetros essenciais e a segurança do ecossistema Digital Sanctuary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-primary" />
              </div>
              <h3 className="font-headline font-bold">Configurações de Segurança</h3>
            </div>
            <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded-full font-semibold">Crítico</span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">Autenticação de 2 Fatores (2FA)</p>
                  <p className="text-xs text-on-surface-variant">Requer código via app ou SMS para login</p>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Tempo de Expiração da Sessão</p>
              <div className="flex gap-3">
                {["30 min", "2 horas", "8 horas"].map((t, i) => (
                  <button
                    key={t}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      i === 0
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Backup */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Database size={20} className="text-primary" />
            </div>
            <h3 className="font-headline font-bold">Backup Automático</h3>
            <span className="text-xs text-on-surface-variant">Redundância de dados</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant">FREQUÊNCIA</label>
              <select className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                <option>Diariamente (00:00)</option>
                <option>A cada 12 horas</option>
                <option>Semanalmente</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-on-surface-variant">DESTINO DO ARMAZENAMENTO</label>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                <Server size={16} className="text-primary" />
                <div>
                  <p className="text-sm font-medium">Amazon S3 Cluster</p>
                  <p className="text-xs text-on-surface-variant">s3://aws-1-sanctuary-vault</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                <HardDrive size={16} className="text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Servidor Local</p>
                  <p className="text-xs text-on-surface-variant">
                    Último backup automático executado com sucesso.
                    Hoje às 00:00 (4.3 GB)
                  </p>
                </div>
                <button className="bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-95">
                  Executar Agora
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Maintenance Mode */}
        <Card className="bg-success/5 border-success/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} className="text-warning" />
            </div>
            <div>
              <h3 className="font-headline font-bold">Modo de Manutenção</h3>
              <p className="text-xs text-on-surface-variant">
                Ao ativar, apenas administradores poderão acessar o sistema. Usuários verão uma tela de aviso.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado: <span className="text-success">Desligado</span></span>
            <div className="w-10 h-6 bg-surface-container-high rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm" />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Bell size={20} className="text-primary" />
            </div>
            <h3 className="font-headline font-bold">Gestão de Notificações</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">Alertas de Saúde Críticos</p>
              <p className="text-xs text-on-surface-variant mb-3">Notificar via SMS/E-mail instantaneamente</p>
              <div className="flex gap-3">
                <button className="p-3 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">
                  <Mail size={20} className="text-primary" />
                </button>
                <button className="p-3 bg-surface-container-highest rounded-xl hover:bg-surface-container-high transition-colors">
                  <Smartphone size={20} className="text-on-surface-variant" />
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-surface-container-low">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity size={18} className="text-success" />
            <div>
              <p className="text-xs text-on-surface-variant uppercase font-semibold">Status de Infraestrutura</p>
              <p className="font-headline text-xl font-bold">Saúde do Sistema: 99.9%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-success font-medium">Todos os serviços online</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
