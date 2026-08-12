"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Bell, Menu, User } from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-context";

type TopBarProps = {
  role: "tutor" | "vet" | "admin";
  onMenuToggle: () => void;
};

const roleTabsConfig = {
  tutor: [
    { label: "Painel", href: "/dashboard" },
    { label: "Pets", href: "/pets" },
    { label: "Prontuários", href: "/prontuarios" },
    { label: "Calendário", href: "/agendamentos" },
  ],
  vet: [
    { label: "Painel", href: "/painel" },
    { label: "Pacientes", href: "/pacientes" },
    { label: "Agenda", href: "/agenda" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin" },
    { label: "Usuários", href: "/usuarios" },
    { label: "Registros", href: "/registros" },
  ],
};

export default function TopBar({ role, onMenuToggle }: TopBarProps) {
  const tabs = roleTabsConfig[role];
  const { profile } = useAuth();
  const userName = profile?.name?.split(" ")[0] || "Usuário";

  return (
    <header className="h-16 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20 flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 lg:left-64 right-0 z-20">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl hover:bg-surface-container-high transition-colors"
      >
        <Menu size={22} className="text-on-surface" />
      </button>

      {/* Tabs - hidden on mobile */}
      <nav className="hidden md:flex items-center gap-1">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container-high"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* Search & Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Buscar registros..."
            className="pl-9 pr-4 py-2 bg-surface-container-high rounded-xl text-sm border-none focus:ring-2 focus:ring-primary/20 w-40 lg:w-56 placeholder:text-outline"
          />
        </div>
        <button className="p-2 rounded-xl hover:bg-surface-container-high transition-colors relative">
          <Bell size={20} className="text-on-surface-variant" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>
        <Link href="/perfil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-gradient flex items-center justify-center">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="Avatar" width={36} height={36} className="w-full h-full object-cover" />
            ) : (
              <User size={16} className="text-on-primary" />
            )}
          </div>
          <span className="text-sm font-medium text-on-surface hidden xl:block">{userName}</span>
        </Link>
      </div>
    </header>
  );
}
