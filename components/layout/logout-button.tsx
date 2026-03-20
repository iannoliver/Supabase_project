"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/auth/error-messages";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut({ scope: "global" });

    if (error) {
      toast.error(getAuthErrorMessage(error.message));
      return;
    }

    toast.success("Sessao encerrada com sucesso.");
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="size-4" />
      Sair
    </Button>
  );
}
