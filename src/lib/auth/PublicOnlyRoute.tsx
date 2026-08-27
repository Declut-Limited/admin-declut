import { Outlet } from "react-router-dom";
import { DefaultRedirect } from "./PermissionRoute";

export default function PublicOnlyRoute() {
  const token = localStorage.getItem("access_token");
  if (token) return <DefaultRedirect />;
  return <Outlet />;
}