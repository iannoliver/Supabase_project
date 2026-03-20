import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card max-w-lg rounded-[2rem] p-10 text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <SearchX className="size-8" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Erro 404
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Não encontramos o que você procurava
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          A página pode ter sido removida, renomeada ou talvez o link esteja incorreto.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link href="/">Voltar para a home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/produtos">Ver produtos</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
