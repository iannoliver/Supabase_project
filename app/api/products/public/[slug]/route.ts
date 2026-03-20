import { createClient } from "@supabase/supabase-js";
import { envClient } from "@/lib/env.client";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createClient(
    envClient.NEXT_PUBLIC_SUPABASE_URL,
    envClient.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) {
    return apiError("Produto não encontrado.", "NOT_FOUND", 404);
  }

  return apiSuccess(data);
}
