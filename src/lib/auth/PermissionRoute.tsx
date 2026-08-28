import { Navigate, Outlet, useLocation } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { useMe } from "@/features/auth/queries";
import PageLoader from "@/components/generic/PageLoader";
import NotFoundState from "@/components/generic/NotFoundState";
import { getLandingPath } from "./permissions";
import type { PermissionModule } from "@/components/generic/Sidebar.config";

const NoAccess = ({ message }: { message: string }) => (
  <NotFoundState icon={<FiLock className="w-5 h-5" />} message={message} />
);

export function DefaultRedirect() {
  const token = localStorage.getItem("access_token");
  const { data: me, isLoading } = useMe();

  if (!token) return <Navigate to="/sign-in" replace />;
  if (isLoading) return <PageLoader fullScreen />;

  const path = getLandingPath(
    me?.role?.permissions,
    me?.dashboardPreferences?.landingPage,
  );

  if (!path) {
    return (
      <NoAccess message="You don't have access to any sections. Contact your administrator." />
    );
  }

  return <Navigate to={path} replace />;
}
export default function PermissionRoute({
  module,
}: {
  module: PermissionModule;
}) {
  const { data: me, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) return <PageLoader fullScreen />;
  
  const permissions = me?.role?.permissions;
  if (permissions?.[module]?.view) return <Outlet />;

  const path = getLandingPath(
    me?.role?.permissions,
    me?.dashboardPreferences?.landingPage,
  );
  if (!path || path === location.pathname) {
    return <NoAccess message="You don't have permission to view this page." />;
  }

  return <Navigate to={path} replace />;
}
