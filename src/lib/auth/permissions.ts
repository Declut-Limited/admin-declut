import { navGroups } from "@/components/generic/Sidebar.config";

type Permissions = Record<string, { view: boolean }> | undefined;

export function getLandingPath(permissions: Permissions): string | null {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (!item.module || permissions?.[item.module]?.view) return item.path;
    }
  }
  return null;
}