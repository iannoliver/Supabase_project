import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="container-shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <Logo />
        <div className="text-sm text-slate-500">
          <p>Experiência pronta para produção com Next.js, Supabase e App Router.</p>
          <div className="mt-2 flex gap-4">
            <Link href="/produtos">Produtos</Link>
            <Link href="/login">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
