import AppShell from "@/components/layout/AppShell";

export default function VetLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="vet">{children}</AppShell>;
}
