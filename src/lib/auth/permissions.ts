import { navGroups } from "@/components/generic/Sidebar.config";

type Permissions = Record<string, { view: boolean }> | undefined;

export function getLandingPath(
  permissions: Permissions,
  preferredModule?: string,
): string | null {
  const allItems = navGroups.flatMap((g) => g.items);

  if (preferredModule) {
    const preferred = allItems.find(
      (item) => item.module === preferredModule.toLowerCase(),
    );
    if (preferred && (!preferred.module || permissions?.[preferred.module]?.view)) {
      return preferred.path;
    }
  }

  for (const item of allItems) {
    if (!item.module || permissions?.[item.module]?.view) return item.path;
  }
  return null;
}