"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  LayoutDashboard,
  PawPrint,
  Stethoscope,
  CalendarDays,
  Users,
  Activity,
  Settings,
  FileText,
  HelpCircle,
  LogOut,
  Plus,
  CreditCard,
  Loader2,
  BedDouble,
  X,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const tutorNav: NavItem[] = [
  { label: "Painel", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "Perfil dos Pets", href: "/pets", icon: <PawPrint size={20} /> },
  { label: "Histórico Médico", href: "/prontuarios", icon: <Stethoscope size={20} /> },
  { label: "Agendamentos", href: "/agendamentos", icon: <CalendarDays size={20} /> },
  { label: "Minha Assinatura", href: "/minha-assinatura", icon: <CreditCard size={20} /> },
];

const vetNav: NavItem[] = [
  { label: "Agenda", href: "/painel", icon: <CalendarDays size={20} /> },
  { label: "Meus Pacientes", href: "/pacientes", icon: <PawPrint size={20} /> },
  { label: "Consultas", href: "/consultas", icon: <Stethoscope size={20} /> },
  { label: "Internações & Plantão", href: "/internacoes", icon: <BedDouble size={20} /> },
  { label: "Configurações", href: "/configuracoes", icon: <Settings size={20} /> },
];

const adminNav: NavItem[] = [
  { label: "Visão Geral", href: "/admin", icon: <LayoutDashboard size={20} /> },
  { label: "Central UTI", href: "/admin/uti", icon: <BedDouble size={20} /> },
  { label: "Usuários", href: "/usuarios", icon: <Users size={20} /> },
  { label: "Monitoramento IA", href: "/monitoramento-ia", icon: <Activity size={20} /> },
  { label: "Registros", href: "/registros", icon: <FileText size={20} /> },
  { label: "Configurações", href: "/configuracoes-globais", icon: <Settings size={20} /> },
];


const roleConfig = {
  tutor: {
    nav: tutorNav,
    title: "Saúde Pet",
    subtitle: "O Santuário Vivo",
    actionLabel: "Marcar Consulta",
    actionHref: "/agendamentos",
  },
  vet: {
    nav: vetNav,
    title: "The Living Sanctuary",
    subtitle: "Painel Veterinário",
    actionLabel: "Nova Consulta",
    actionHref: "/consultas",
  },
  admin: {
    nav: adminNav,
    title: "Sanctuary Admin",
    subtitle: "System Controller",
    actionLabel: "Novo Alerta",
    actionHref: "/admin",
  },
};

type SidebarProps = {
  role: "tutor" | "vet" | "admin";
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const config = roleConfig[role];
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    await signOut();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 h-screen bg-surface-container-lowest flex flex-col border-r border-outline-variant/30 fixed left-0 top-0 z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Brand */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center">
              <PawPrint size={20} className="text-on-primary" />
            </div>
            <div>
              <p className="font-headline font-bold text-sm text-on-surface">{config.title}</p>
              <p className="text-xs text-on-surface-variant">{config.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-surface-container-high">
            <X size={20} className="text-on-surface-variant" />
          </button>
        </div>

        {/* User info */}
        {profile && (
          <div className="px-6 pb-4">
            <Link href="/perfil" onClick={onClose} className="flex items-center gap-3 bg-surface-container-high rounded-xl p-3 hover:bg-surface-container-highest transition-colors">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-gradient flex items-center justify-center shrink-0">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-on-primary font-bold text-sm">
                    {profile.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{profile.name}</p>
                <p className="text-xs text-on-surface-variant truncate">{profile.email}</p>
              </div>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {config.nav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="px-4 mb-4">
          <Link
            href={config.actionHref}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full bg-primary-gradient text-on-primary font-headline font-semibold py-3 px-4 rounded-xl shadow-sm hover:opacity-95 transition-all text-sm"
          >
            <Plus size={18} />
            {config.actionLabel}
          </Link>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 space-y-1">
          <Link href="/manual" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container-high w-full transition-all">
            <HelpCircle size={18} />
            Manual
          </Link>
          <button
            onClick={handleLogout}
            disabled={signingOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-error hover:bg-error-container/30 w-full transition-all"
          >
            {signingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            {signingOut ? "Saindo..." : "Sair"}
          </button>
        </div>

        {/* Copyright */}
        <div className="px-4 pb-4 flex items-center justify-center gap-3 border-t border-outline-variant/20 pt-3">
          <Image src="/logo-tt.svg" alt="Thinking Tools" width={32} height={32} className="opacity-60" />
          <span className="text-[11px] text-on-surface-variant/70 uppercase tracking-widest font-medium">&copy;2026 Empática Pet</span>
        </div>
      </aside>
    </>
  );
}
