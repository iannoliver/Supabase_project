import type { ApiResponse, Product } from "@/types";
import { getBaseUrl } from "@/lib/utils/url";

export async function getPublicProducts() {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/products/public`, {
    next: { revalidate: 60 },
  });
  const payload = (await response.json()) as ApiResponse<{
    featured: Product[];
    products: Product[];
  }>;

  if (!payload.success) {
    throw new Error(payload.message);
  }

  return payload.data;
}

export async function getPublicProductBySlug(slug: string) {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/products/public/${slug}`, {
    next: { revalidate: 60 },
  });
  const payload = (await response.json()) as ApiResponse<Product>;

  if (!payload.success) {
    return null;
  }

  return payload.data;
}
