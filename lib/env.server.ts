import "server-only";

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");
}

export const envServer = {
  SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey,
} as const;