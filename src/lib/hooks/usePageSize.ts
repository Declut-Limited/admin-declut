import { useMe } from "@/features/auth/queries";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination";

export function usePageSize() {
  const { data: me } = useMe();
  return me?.dashboardPreferences?.rowsPerPage ?? DEFAULT_PAGE_SIZE;
}