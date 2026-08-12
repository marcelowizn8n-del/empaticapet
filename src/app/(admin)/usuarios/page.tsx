"use client";

import Card from "@/components/ui/Card";
import { Search, Filter, UserPlus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, TrendingUp, BarChart3 } from "lucide-react";

const users = [
  { name: "Ricardo Silveira", id: "#SA-2301", type: "Tutor", typeColor: "bg-primary/10 text-primary", email: "ricardo.s@email.com", date: "12 Out, 2023", status: "Ativo", statusColor: "text-success" },
  { name: "Dra. Beatriz Mendes", id: "CRMV-4529-SP", type: "Veterinário", typeColor: "bg-secondary/10 text-secondary", email: "beatriz.m@sanctuary.vet", date: "05 Ago, 2023", status: "Ativo", statusColor: "text-success" },
  { name: "Marcos Oliver", id: "#SA-1002", type: "Tutor", typeColor: "bg-primary/10 text-primary", email: "oliver_marcos@gmail.com", date: "15 Set, 2022", status: "Inativo", statusColor: "text-on-surface-variant" },
  { name: "Fernanda Lima", id: "#SA-1842", type: "Tutor", typeColor: "bg-primary/10 text-primary", email: "fernanda.lima@uol.com.br", date: "21 Jan, 2024", status: "Ativo", statusColor: "text-success" },
];

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">Gestão de Usuários</h1>
        <p className="text-on-surface-variant mt-1">
          Gerencie o acesso de tutores e médicos veterinários ao sistema The Living Sanctuary.
          Monitore atividades e mantenha a integridade da comunidade.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-on-surface-variant uppercase font-semibold">TOTAL USUÁRIOS</p>
          <p className="font-headline text-3xl font-bold mt-1">1,284</p>
          <p className="text-xs text-success font-medium">+12% este mês</p>
        </Card>
        <Card>
          <p className="text-xs text-on-surface-variant uppercase font-semibold">VETERINÁRIOS</p>
          <p className="font-headline text-3xl font-bold mt-1">342</p>
          <p className="text-xs text-on-surface-variant">Ativos em 12 clínicas</p>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <p className="text-xs text-on-surface-variant font-semibold">Qualidade do Ecossistema</p>
          <p className="text-sm text-on-surface-variant mt-1">98% dos usuários possuem perfis completos e validados.</p>
          <div className="h-2 bg-surface-container-high rounded-full mt-2">
            <div className="h-full bg-primary rounded-full" style={{ width: "98%" }} />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <select className="px-4 py-2.5 bg-surface-container-highest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
            <option>Todos os Tipos</option>
            <option>Tutor</option>
            <option>Veterinário</option>
            <option>Admin</option>
          </select>
          <select className="px-4 py-2.5 bg-surface-container-highest border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20">
            <option>Status: Ativos</option>
            <option>Inativos</option>
            <option>Todos</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high">
            <Filter size={14} /> Filtros Avançados
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-gradient text-on-primary rounded-xl text-sm font-semibold hover:opacity-95 transition-all">
          <UserPlus size={16} /> Convidar Usuário
        </button>
      </div>

      {/* Users Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20">
                <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">Nome</th>
                <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">Tipo</th>
                <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">Email</th>
                <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">Cadastro</th>
                <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-on-surface-variant uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center text-sm font-bold text-on-surface-variant">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{u.name}</p>
                        <p className="text-xs text-on-surface-variant">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${u.typeColor}`}>{u.type}</span>
                  </td>
                  <td className="p-4 text-sm text-on-surface-variant">{u.email}</td>
                  <td className="p-4 text-sm text-on-surface-variant">{u.date}</td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${u.statusColor} flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Ativo" ? "bg-success" : "bg-outline-variant"}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                        <Eye size={14} className="text-on-surface-variant" />
                      </button>
                      <button className="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
                        <Edit size={14} className="text-on-surface-variant" />
                      </button>
                      <button className="p-2 hover:bg-error-container/30 rounded-lg transition-colors">
                        <Trash2 size={14} className="text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between border-t border-outline-variant/20">
          <p className="text-xs text-on-surface-variant">Mostrando 4 de 1,284 usuários</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg bg-primary text-on-primary text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-lg text-on-surface-variant text-xs hover:bg-surface-container-high">2</button>
            <button className="w-8 h-8 rounded-lg text-on-surface-variant text-xs hover:bg-surface-container-high">3</button>
            <span className="text-on-surface-variant text-xs px-1">...</span>
            <button className="w-8 h-8 rounded-lg text-on-surface-variant text-xs hover:bg-surface-container-high">321</button>
            <button className="p-1 hover:bg-surface-container-high rounded-lg">
              <ChevronRight size={16} className="text-on-surface-variant" />
            </button>
          </div>
        </div>
      </Card>

      {/* AI Insight */}
      <Card className="bg-gradient-to-r from-primary-dark to-primary text-white border-none">
        <div className="flex items-start gap-3">
          <TrendingUp size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-white/60">Insight de IA</p>
            <h3 className="font-headline font-bold text-lg mt-1">Crescimento da Comunidade</h3>
            <p className="text-sm text-white/80 mt-1">
              O registro de novos veterinários aumentou 22% nos últimos 15 dias.
              Recomenda-se agilizar a revisão de documentos para manter o fluxo de onboarding eficiente.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
