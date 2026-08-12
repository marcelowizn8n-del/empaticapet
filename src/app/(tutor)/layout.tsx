import AppShell from "@/components/layout/AppShell";

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="tutor">{children}</AppShell>;
}
