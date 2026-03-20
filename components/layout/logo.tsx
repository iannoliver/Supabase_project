import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
        PC
      </span>
      <span>
        <span className="block text-sm font-semibold tracking-[0.24em] text-slate-500">PULSE</span>
        <span className="block text-base font-semibold text-slate-950">Commerce</span>
      </span>
    </Link>
  );
}
