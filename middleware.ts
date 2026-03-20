import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { supabase, response } = createMiddlewareClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/admin") && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (!user) {
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<{ role: "admin" | "editor" }>();

  if (pathname.startsWith("/admin") && !profile) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "profile-missing");
    return NextResponse.redirect(loginUrl);
  }

  if (
    (pathname.startsWith("/admin/usuarios") || pathname.startsWith("/admin/pedidos")) &&
    profile?.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname === "/login" && profile) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
