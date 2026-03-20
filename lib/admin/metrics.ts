import { createServiceClient } from "@/lib/supabase/service";
import type { DashboardMetrics } from "@/types";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = createServiceClient();

  const [{ count: totalUsers }, { count: totalProducts }, { count: activeProducts }, { count: featuredProducts }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("active", true),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("featured", true),
    ]);

  return {
    totalUsers: totalUsers ?? 0,
    totalProducts: totalProducts ?? 0,
    activeProducts: activeProducts ?? 0,
    featuredProducts: featuredProducts ?? 0,
  };
}
