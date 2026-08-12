"use client";

import Link from "next/link";
import Image from "next/image";
import {
  PawPrint,
  ArrowLeft,
  UserPlus,
  LogIn,
  LayoutDashboard,
  Stethoscope,
  Calendar,
  Brain,
  CreditCard,
  Shield,
  Users,
  Settings,
  FileText,
  Camera,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function Section({ icon, title, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-5 hover:bg-surface-container-low transition-colors"
      >
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h3 className="font-headline font-bold text-on-surface text-left flex-1">{title}</h3>
        <ChevronDown size={20} className={`text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3 text-sm text-on-surface-variant leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ManualPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl hover:bg-surface-container-high transition-colors">
            <ArrowLeft size={20} className="text-on-surface-variant" />
          </Link>
          <PawPrint size={24} className="text-primary" />
          <h1 className="font-headline font-bold text-lg text-primary">Manual do Usuário</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {/* Intro */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white mb-8">
          <h2 className="font-headline text-3xl font-bold mb-3">Bem-vindo à Empática Pet</h2>
          <p className="text-white/80 max-w-2xl">
            A plataforma que conecta tutores de pets, veterinários e administradores em um ecossistema
            completo de saúde animal. Aqui você encontra tudo para cuidar de quem você mais ama.
          </p>
        </div>

        {/* Getting Started */}
        <Section icon={<UserPlus size={20} className="text-primary" />} title="Como Criar sua Conta" defaultOpen>
          <p><strong>Para Tutores:</strong></p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Acesse <strong>empaticapet.app/cadastro</strong></li>
            <li>Preencha seu nome, e-mail, telefone e crie uma senha</li>
            <li>Aceite os termos de uso</li>
            <li>Clique em <strong>Criar Minha Conta</strong></li>
            <li>Você será redirecionado ao seu painel</li>
          </ol>
          <p className="mt-3"><strong>Para Veterinários:</strong></p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Acesse <strong>empaticapet.app/cadastro-veterinario</strong></li>
            <li>Preencha seus dados profissionais (nome, CRMV, especialidade, clínica)</li>
            <li>Crie uma senha segura</li>
            <li>Aceite os termos e clique em <strong>Criar Minha Conta Profissional</strong></li>
          </ol>
        </Section>

        <Section icon={<LogIn size={20} className="text-primary" />} title="Login e Logout">
          <p><strong>Para entrar:</strong></p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Acesse <strong>empaticapet.app/login</strong></li>
            <li>Digite seu e-mail e senha</li>
            <li>Clique em <strong>Entrar</strong></li>
            <li>Você será direcionado ao painel correspondente ao seu perfil</li>
          </ol>
          <p className="mt-3"><strong>Para sair:</strong></p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>No menu lateral, clique no botão <strong>Sair</strong> (em vermelho)</li>
            <li>Você será redirecionado à tela de login</li>
          </ol>
        </Section>

        <Section icon={<Camera size={20} className="text-primary" />} title="Editar Perfil e Avatar">
          <ol className="list-decimal ml-5 space-y-1">
            <li>Clique no seu <strong>nome ou foto</strong> no menu lateral ou no topo da página</li>
            <li>Na página <strong>Meu Perfil</strong>, você pode alterar seu nome e telefone</li>
            <li>Para trocar a foto, clique no ícone de <strong>câmera</strong> sobre o avatar</li>
            <li>Escolha uma imagem do seu dispositivo</li>
            <li>Clique em <strong>Salvar Alterações</strong></li>
          </ol>
          <p className="mt-2 text-xs bg-amber-light text-amber-dark rounded-lg p-3">
            <strong>Nota:</strong> O e-mail não pode ser alterado após o cadastro.
          </p>
        </Section>

        {/* Tutor Section */}
        <div className="pt-4">
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <PawPrint size={22} className="text-coral" /> Guia do Tutor
          </h2>
        </div>

        <Section icon={<LayoutDashboard size={20} className="text-primary" />} title="Painel do Tutor">
          <p>O painel é sua tela principal com uma visão geral da saúde dos seus pets:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Status de Bem-Estar</strong> — veja o estado de cada pet (saudável, alerta, etc.)</li>
            <li><strong>Sinais Vitais</strong> — frequência cardíaca, atividade, peso e sono</li>
            <li><strong>Próximos Agendamentos</strong> — consultas e vacinas marcadas</li>
            <li><strong>Alertas de Saúde</strong> — lembretes e notificações importantes</li>
            <li><strong>Ações Rápidas</strong> — acesso direto a importar exame, agendar, prontuário e pets</li>
          </ul>
        </Section>

        <Section icon={<PawPrint size={20} className="text-primary" />} title="Perfil dos Pets">
          <p>Gerencie seus pets cadastrados:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Veja todos os seus pets com nome, raça, idade e status</li>
            <li>Clique em um pet para ver detalhes: peso, vacinas, histórico</li>
            <li>Acompanhe a evolução de peso e alertas de saúde</li>
          </ul>
        </Section>

        <Section icon={<FileText size={20} className="text-primary" />} title="Histórico Médico (Prontuários)">
          <p>Acesse todo o histórico clínico dos seus pets:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Linha do tempo</strong> — todos os eventos médicos em ordem cronológica</li>
            <li><strong>Pulse Score</strong> — pontuação geral de saúde</li>
            <li><strong>Importação com IA</strong> — importe exames e a IA extrai os dados automaticamente</li>
          </ul>
        </Section>

        <Section icon={<Brain size={20} className="text-primary" />} title="Importar Exames com IA">
          <ol className="list-decimal ml-5 space-y-1">
            <li>Vá em <strong>Ações Rápidas → Importar Exame</strong></li>
            <li>Faça upload da foto ou PDF do exame</li>
            <li>A IA analisa e extrai os dados automaticamente</li>
            <li>Revise os dados extraídos (você pode editar)</li>
            <li>Confirme para salvar no prontuário do pet</li>
          </ol>
          <p className="mt-2 text-xs bg-lavender-light text-lavender-dark rounded-lg p-3">
            <strong>Dica:</strong> A IA tem precisão de 96% na extração. Sempre revise os dados antes de confirmar.
          </p>
        </Section>

        <Section icon={<Calendar size={20} className="text-primary" />} title="Agendamentos">
          <p>Gerencie as consultas e vacinas dos seus pets:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Veja o calendário com todos os agendamentos</li>
            <li>Acompanhe alertas de vacinas próximas</li>
            <li>Marque novas consultas pelo botão <strong>Marcar Consulta</strong></li>
          </ul>
        </Section>

        <Section icon={<CreditCard size={20} className="text-primary" />} title="Minha Assinatura">
          <p>Gerencie seu plano na plataforma:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Veja seu plano atual e uso (pets cadastrados, importações com IA)</li>
            <li>Histórico de pagamentos</li>
            <li>Faça upgrade ou cancele pelo Mercado Pago</li>
          </ul>
          <p className="mt-2"><strong>Planos para Tutores:</strong></p>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Gratuito</strong> — 1 pet, funcionalidades básicas</li>
            <li><strong>Essencial</strong> (R$19,90/mês) — até 3 pets, 5 importações IA/mês</li>
            <li><strong>Premium</strong> (R$39,90/mês) — pets ilimitados, importações ilimitadas, prioridade</li>
          </ul>
        </Section>

        {/* Vet Section */}
        <div className="pt-4">
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <Stethoscope size={22} className="text-sky" /> Guia do Veterinário
          </h2>
        </div>

        <Section icon={<LayoutDashboard size={20} className="text-primary" />} title="Painel do Veterinário">
          <p>Sua central de trabalho com visão geral do dia:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Estatísticas</strong> — consultas do dia, pacientes ativos, exames pendentes</li>
            <li><strong>Lista de Pacientes</strong> — acesso rápido aos pacientes recentes</li>
            <li><strong>Agenda do Dia</strong> — consultas confirmadas, pendentes e em andamento</li>
          </ul>
        </Section>

        <Section icon={<Calendar size={20} className="text-primary" />} title="Agenda">
          <p>Calendário semanal com seus atendimentos:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Visualização por semana com blocos coloridos por tipo</li>
            <li>Clique em uma consulta para ver detalhes e sinais vitais</li>
            <li>Crie novas consultas pelo botão <strong>Nova Consulta</strong></li>
          </ul>
        </Section>

        <Section icon={<Users size={20} className="text-primary" />} title="Pacientes e Consultas">
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Meus Pacientes</strong> — lista completa de pets que você atende</li>
            <li><strong>Consultas</strong> — histórico de todas as consultas realizadas</li>
            <li><strong>Configurações</strong> — dados profissionais e preferências</li>
          </ul>
          <p className="mt-2"><strong>Planos para Veterinários:</strong></p>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Profissional</strong> (R$49,90/mês) — até 50 pacientes, agenda digital</li>
            <li><strong>Clínica</strong> (R$99,90/mês) — pacientes ilimitados, relatórios IA, multi-profissional</li>
            <li><strong>Hospital</strong> (R$199,90/mês) — tudo + API, suporte dedicado, SLA</li>
          </ul>
        </Section>

        {/* Admin Section */}
        <div className="pt-4">
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
            <Shield size={22} className="text-lavender" /> Guia do Administrador
          </h2>
        </div>

        <Section icon={<Settings size={20} className="text-primary" />} title="Painel Administrativo">
          <p>Controle total da plataforma:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Visão Geral</strong> — métricas globais (pets, usuários, exames IA, créditos)</li>
            <li><strong>Usuários</strong> — gerenciar tutores e veterinários cadastrados</li>
            <li><strong>Monitoramento IA</strong> — precisão, volume de processamento, estabilidade</li>
            <li><strong>Registros</strong> — registros clínicos globais</li>
            <li><strong>Configurações Globais</strong> — segurança, backups, modo manutenção</li>
          </ul>
        </Section>

        {/* FAQ */}
        <div className="pt-4">
          <h2 className="font-headline text-xl font-bold text-on-surface mb-4">Perguntas Frequentes</h2>
        </div>

        <Section icon={<PawPrint size={20} className="text-primary" />} title="Esqueci minha senha, como recuperar?">
          <p>Na tela de login, clique em <strong>"Esqueceu a senha?"</strong>. Digite seu e-mail e você receberá um link para redefinir sua senha.</p>
        </Section>

        <Section icon={<PawPrint size={20} className="text-primary" />} title="Posso cancelar minha assinatura a qualquer momento?">
          <p>Sim! Você pode cancelar a qualquer momento em <strong>Minha Assinatura</strong>. Não há multa ou fidelidade. Seu acesso continua até o fim do período pago.</p>
        </Section>

        <Section icon={<PawPrint size={20} className="text-primary" />} title="Os dados do meu pet estão seguros?">
          <p>Sim. Utilizamos criptografia SSL, banco de dados com isolamento por usuário (Row Level Security) e backups automáticos. Seus dados são protegidos e nunca compartilhados.</p>
        </Section>

        <Section icon={<PawPrint size={20} className="text-primary" />} title="Como funciona o período de teste?">
          <p>Todos os planos pagos oferecem <strong>7 dias grátis</strong> para você experimentar. Se não gostar, cancele antes do fim do trial e não será cobrado.</p>
        </Section>

        {/* Footer */}
        <footer className="pt-8 pb-4 flex items-center justify-center gap-3">
          <Image src="/logo-tt.svg" alt="Thinking Tools" width={32} height={32} className="opacity-60" />
          <span className="text-[11px] text-on-surface-variant/70 uppercase tracking-widest font-medium">&copy;2026 Empática Pet</span>
        </footer>
      </main>
    </div>
  );
}
