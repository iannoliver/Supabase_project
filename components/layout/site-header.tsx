import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

function getFriendlyName(fullName: string | null, email: string | null) {
  if (fullName?.trim()) {
    return fullName.trim().split(" ")[0];
  }

  if (email?.trim()) {
    return email.trim().split("@")[0];
  }

  return "cliente";
}

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? await supabase.from("profiles").select("full_name, email, role").eq("id", user.id).maybeSingle()
    : { data: null };

  const profileData = profile.data;
  const greetingName = getFriendlyName(profileData?.full_name ?? null, profileData?.email ?? user?.email ?? null);
  const canAccessAdmin = profileData?.role === "admin" || profileData?.role === "editor";

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="transition hover:text-slate-950">Home</Link>
          <Link href="/produtos" className="transition hover:text-slate-950">Produtos</Link>
          <Link href="/#destaques" className="transition hover:text-slate-950">Destaques</Link>
        </nav>
        <div className="flex items-center gap-3">
          <CartLink />
          {user ? (
            <>
              <div className="hidden rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-sm text-slate-600 shadow-sm lg:block">
                Ola, <span className="font-semibold text-slate-950">{greetingName}</span>, seja bem-vindo
              </div>
              {canAccessAdmin ? (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin">Painel admin</Link>
                </Button>
              ) : null}
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Entrar</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href="/produtos">Explorar catalogo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
