import { cn } from "@/lib/utils/cn";

export function Table({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className="table-shell">
      <table className={cn("min-w-full divide-y divide-slate-200/70", className)}>{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-slate-50/80">{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>;
}

export function TR({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-slate-50/70">{children}</tr>;
}

export function TH({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TD({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-5 py-4 text-sm text-slate-700", className)}>{children}</td>;
}
