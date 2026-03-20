const nextPublicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const nextPublicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!nextPublicSupabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}

if (!nextPublicSupabaseAnonKey) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const envClient = {
  NEXT_PUBLIC_SUPABASE_URL: nextPublicSupabaseUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: nextPublicSupabaseAnonKey,
} as const;