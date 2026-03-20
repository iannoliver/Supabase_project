import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAuthenticatedUser() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function getCurrentProfile() {
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return profile ?? null;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?reason=profile-missing");
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect("/admin");
  }

  return profile;
}
