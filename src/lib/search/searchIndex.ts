import { navGroups } from "@/components/generic/Sidebar.config";
import { FiSettings, FiUser } from "react-icons/fi";

export interface SearchableItem {
  label: string;
  path: string;
  tab?: string;
  group: string;
  icon?: React.ComponentType<{ className?: string }> | string;
}

const navItems: SearchableItem[] = navGroups.flatMap((group) =>
  group.items.map((item) => ({
    label: item.label,
    path: item.path,
    group: group.label,
    icon: item.icon,
  }))
);

const settingsTabs: SearchableItem[] = [
  { label: "General Settings", path: "/settings", tab: "General", group: "Settings", icon: FiSettings },
  { label: "Branding", path: "/settings", tab: "Branding", group: "Settings", icon: FiSettings },
  { label: "Payments Settings", path: "/settings", tab: "Payments", group: "Settings", icon: FiSettings },
  { label: "Fees & Commission", path: "/settings", tab: "Fees & Commission", group: "Settings", icon: FiSettings },
  { label: "Roles & Permissions", path: "/settings", tab: "Roles & Permissions", group: "Settings", icon: FiSettings },
];

const profileTabs: SearchableItem[] = [
  { label: "Profile General", path: "/profile", tab: "General", group: "Profile", icon: FiUser },
  { label: "Personalization", path: "/profile", tab: "Personalization", group: "Profile", icon: FiUser },
  { label: "Account", path: "/profile", tab: "Account", group: "Profile", icon: FiUser },
  { label: "Security & Login", path: "/profile", tab: "Security & Login", group: "Profile", icon: FiUser },
];

export const searchIndex: SearchableItem[] = [...navItems, ...settingsTabs, ...profileTabs];