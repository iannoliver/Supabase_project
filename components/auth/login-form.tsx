"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/forms/form-field";
import { getAuthErrorMessage } from "@/lib/auth/error-messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const redirectParam = searchParams.get("redirectTo");
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/admin";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword(values);

      if (error) {
        toast.error(getAuthErrorMessage(error.message));
        return;
      }

      toast.success("Login realizado com sucesso.");
      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="glass-card w-full max-w-md rounded-[2rem] p-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Admin access</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Entrar no painel</h1>
        <p className="text-sm leading-6 text-slate-600">
          Faca login com um usuario do Supabase Auth e perfil configurado na tabela `profiles`.
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-3">
        <FormField label="E-mail" error={form.formState.errors.email?.message}>
          <Input type="email" placeholder="voce@empresa.com" {...form.register("email")} />
        </FormField>
        <FormField label="Senha" error={form.formState.errors.password?.message}>
          <Input type="password" placeholder="Sua senha" {...form.register("password")} />
        </FormField>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        Area publica disponivel em{" "}
        <Link href="/" className="font-medium text-slate-950">
          /
        </Link>
        .
      </p>
    </div>
  );
}
