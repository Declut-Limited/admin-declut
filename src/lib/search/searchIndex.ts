import { navGroups, type PermissionModule } from "@/components/generic/Sidebar.config";
import { FiSettings, FiUser } from "react-icons/fi";

export interface SearchableItem {
  label: string;
  path: string;
  tab?: string;
  group: string;
  module?: PermissionModule;
  icon?: React.ComponentType<{ className?: string }> | string;
}

const navItems: SearchableItem[] = navGroups.flatMap((group) =>
  group.items.map((item) => ({
    label: item.label,
    path: item.path,
    group: group.label,
    module: item.module,
    icon: item.icon,
  })),
);

const settingsTabs: SearchableItem[] = [
  { label: "General Settings", path: "/settings", tab: "General", group: "Settings", module: "settings", icon: FiSettings },
  { label: "Payments Settings", path: "/settings", tab: "Payments", group: "Settings", module: "settings", icon: FiSettings },
  { label: "Fees & Commission", path: "/settings", tab: "Fees & Commission", group: "Settings", module: "settings", icon: FiSettings },
  { label: "Roles & Permissions", path: "/settings", tab: "Roles & Permissions", group: "Settings", module: "settings", icon: FiSettings },
];

const profileTabs: SearchableItem[] = [
  { label: "Profile General", path: "/profile", tab: "General", group: "Profile", icon: FiUser },
  { label: "Personalization", path: "/profile", tab: "Personalization", group: "Profile", icon: FiUser },
  { label: "Account", path: "/profile", tab: "Account", group: "Profile", icon: FiUser },
  { label: "Security & Login", path: "/profile", tab: "Security & Login", group: "Profile", icon: FiUser },
];

export const searchIndex: SearchableItem[] = [
  ...navItems,
  ...settingsTabs,
  ...profileTabs,
];

export function getSearchIndex(
  permissions?: Record<string, { view: boolean }>,
): SearchableItem[] {
  if (!permissions) return [];
  return searchIndex.filter(
    (item) => !item.module || permissions[item.module]?.view,
  );
}