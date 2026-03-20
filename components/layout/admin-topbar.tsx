import { LogoutButton } from "@/components/layout/logout-button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types";

export function AdminTopbar({ profile }: { profile: Profile }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/70 bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm text-slate-500">Painel administrativo</p>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-950">Olá, {profile.full_name || profile.email}</h1>
          <Badge variant="neutral">{profile.role}</Badge>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
