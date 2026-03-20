import type { AppRole } from "@/types";

export const permissions = {
  canManageUsers(role: AppRole) {
    return role === "admin";
  },
  canManageProducts(role: AppRole) {
    return role === "admin" || role === "editor";
  },
};
