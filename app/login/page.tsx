import type { Metadata } from "next";
import { Suspense } from "react";
import type { LucideIcon } from "lucide-react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/layout/logo";

const loginHighlights: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Sessao segura",
    description: "Integracao moderna com @supabase/ssr.",
    icon: ShieldCheck,
  },
  {
    title: "Perfis e permissoes",
    description: "Admin e editor com controle de acesso no servidor.",
    icon: LockKeyhole,
  },
];

export const metadata: Metadata = {
  title: "Login",
  description: "Acesso ao painel administrativo com Supabase Auth SSR.",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo href="/" />
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Painel SaaS clean</p>
          <h1 className="text-5xl font-semibold tracking-tight">
            Controle catalogo, usuarios e destaque produtos com seguranca.
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            Autenticacao SSR, autorizacao por perfil e base pronta para evoluir sem retrabalho.
          </p>
        </div>
        <div className="grid gap-4">
          {loginHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <Icon className="size-5 text-violet-300" />
                <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-16 sm:px-6">
        <Suspense fallback={<div className="glass-card w-full max-w-md rounded-[2rem] p-8" />}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
