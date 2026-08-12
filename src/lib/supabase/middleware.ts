import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes that don't require auth
  const publicPaths = ["/", "/login", "/cadastro", "/cadastro-veterinario", "/planos", "/pagamento"];
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/")
  );

  // API routes are always accessible
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");

  // Static assets
  const isStaticAsset =
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/favicon") ||
    request.nextUrl.pathname.includes(".");

  if (!user && !isPublicPath && !isApiRoute && !isStaticAsset) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If user is logged in and tries to access login/register, redirect to their dashboard
  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/cadastro" || request.nextUrl.pathname === "/cadastro-veterinario")) {
    // Try profiles table first, fall back to user_metadata
    let role = "tutor";
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role) {
      role = profile.role;
    } else {
      role = user.user_metadata?.role || "tutor";
    }

    const url = request.nextUrl.clone();
    if (role === "vet") {
      url.pathname = "/painel";
    } else if (role === "admin") {
      url.pathname = "/admin";
    } else {
      url.pathname = "/dashboard";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
