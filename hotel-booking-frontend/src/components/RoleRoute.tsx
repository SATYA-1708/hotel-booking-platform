import { Navigate } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import useAppContext from "../hooks/useAppContext";

type Role = "user" | "admin" | "hotel_owner";

type Props = {
  children: React.ReactNode;
  allow?: Role[];
};

const RoleRoute = ({ children, allow }: Props) => {
  const { isLoggedIn } = useAppContext();

  const { data: user, isLoading } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser,
    { enabled: isLoggedIn },
  );

  if (!isLoggedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  const allowedRoles: Role[] = allow ?? ["user", "admin", "hotel_owner"];

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
