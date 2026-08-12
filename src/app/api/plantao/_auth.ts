import { createClient } from "@/lib/supabase/server";

// Garante que o requisitante está autenticado e é veterinário ou admin.
// Retorna null se autorizado, ou uma mensagem de erro.
export async function requireVet(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "Não autenticado.";

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["vet", "admin"].includes(profile.role)) {
    return "Acesso restrito a veterinários.";
  }

  return null;
}
