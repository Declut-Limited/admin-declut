import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "@/features/auth/queries";
import PageLoader from "@/components/generic/PageLoader";

export default function ProtectedRoute() {
  const token = localStorage.getItem("access_token");
  const { isLoading, isError } = useMe();

  if (!token) return <Navigate to="/sign-in" replace />;
  if (isLoading) return <PageLoader />;
  if (isError) return <Navigate to="/sign-in" replace />;

  return <Outlet />;
}