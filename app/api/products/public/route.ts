import { createClient } from "@supabase/supabase-js";
import { envClient } from "@/lib/env.client";
import { apiError, apiSuccess } from "@/lib/utils/api-response";

export async function GET() {
  const supabase = createClient(
    envClient.NEXT_PUBLIC_SUPABASE_URL,
    envClient.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return apiError("Não foi possível carregar os produtos públicos.", "PUBLIC_PRODUCTS_FETCH_FAILED", 500);
  }

  const products = data ?? [];
  const featured = products.filter((product) => product.featured).slice(0, 3);

  return apiSuccess({
    featured,
    products,
  });
}
