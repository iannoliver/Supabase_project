import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { envClient } from "@/lib/env.client";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    envClient.NEXT_PUBLIC_SUPABASE_URL,
    envClient.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
  cookiesToSet: Array<{
    name: string;
    value: string;
    options?: {
      domain?: string;
      path?: string;
      expires?: Date;
      httpOnly?: boolean;
      maxAge?: number;
      sameSite?: "lax" | "strict" | "none";
      secure?: boolean;
    };
  }>,
) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Middleware refreshes session cookies during SSR when needed.
          }
        },
      },
    },
  );
}
