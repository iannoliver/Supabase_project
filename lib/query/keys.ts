export const queryKeys = {
  adminMetrics: ["admin-metrics"] as const,
  adminProducts: (filters = "all") => ["admin-products", filters] as const,
  adminUsers: ["admin-users"] as const,
};
