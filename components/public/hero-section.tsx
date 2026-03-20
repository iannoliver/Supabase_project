import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ShieldCheck, Sparkles, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Curadoria visual",
    description: "Cards elegantes e hierarquia comercial.",
    icon: Store,
  },
  {
    title: "Autenticacao SSR",
    description: "Sessao segura com Supabase Auth.",
    icon: ShieldCheck,
  },
  {
    title: "Operacao preparada",
    description: "Catalogo, usuarios e API interna organizados.",
    icon: Sparkles,
  },
];

const analyticsCards = [
  ["Produtos ativos", "98%", "Atualizacao em tempo real da operacao"],
  ["Itens em destaque", "12", "Campanhas sazonais com visibilidade maxima"],
  ["Cobertura mobile", "100%", "Layout responsivo e pronto para expansao"],
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-shell grid gap-10 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm">
            <Sparkles className="size-4" />
            Vitrine premium com gestao robusta
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Produtos bem apresentados, operacao organizada e experiencia pronta para escalar.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Uma base profissional para vender, destacar e administrar catalogo com seguranca,
              clareza e otima experiencia em desktop e mobile.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/produtos">
                Ver catalogo
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/login">Acessar administracao</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm">
                  <Icon className="size-5 text-slate-950" />
                  <h3 className="mt-4 text-sm font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-violet-200/40 via-white/20 to-sky-200/30 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/60 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/15">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Pulse Analytics</p>
                  <h2 className="mt-2 text-2xl font-semibold">Destaques do catalogo</h2>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Online
                </span>
              </div>
              <div className="mt-8 grid gap-4">
                {analyticsCards.map(([label, value, description]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-300">{label}</p>
                      <p className="text-2xl font-semibold">{value}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
