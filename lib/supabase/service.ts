import "server-only";

import { createClient } from "@supabase/supabase-js";
import { envClient } from "@/lib/env.client";
import { envServer } from "@/lib/env.server";

export function createServiceClient() {
  return createClient(envClient.NEXT_PUBLIC_SUPABASE_URL, envServer.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
