import "server-only";

import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { envClient } from "@/lib/env.client";
import type { AppRole, Profile } from "@/types";

export async function getApiAuth(request: NextRequest) {
  const supabase = createServerClient(
    envClient.NEXT_PUBLIC_SUPABASE_URL,
    envClient.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return { supabase, user, profile: profile ?? null };
}

export function hasRole(role: AppRole | null | undefined, allowedRoles: AppRole[]) {
  return !!role && allowedRoles.includes(role);
}
