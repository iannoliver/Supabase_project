"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ReceiptText, Users } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { Profile, AppRole } from "@/types";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: AppRole[];
};

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/produtos",
    label: "Produtos",
    icon: Package,
    roles: ["admin", "editor"],
  },
  {
    href: "/admin/pedidos",
    label: "Pedidos",
    icon: ReceiptText,
    roles: ["admin"],
  },
  {
    href: "/admin/usuarios",
    label: "Usuarios",
    icon: Users,
    roles: ["admin"],
  },
];

export function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200/70 bg-white px-6 py-8 lg:flex lg:flex-col">
      <Logo href="/admin" />
      <div className="mt-8 rounded-3xl bg-slate-950 p-5 text-white">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Perfil</p>
        <p className="mt-3 text-lg font-semibold">{profile.full_name || profile.email}</p>
        <p className="text-sm text-slate-300">{profile.email}</p>
        <Badge className="mt-4 bg-white/10 text-white" variant="neutral">
          {profile.role}
        </Badge>
      </div>
      <nav className="mt-8 space-y-2">
        {navItems
          .filter((item) => item.roles.includes(profile.role))
          .map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}