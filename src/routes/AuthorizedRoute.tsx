import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useIsAdmin } from "../hooks";

interface AuthorizedRouteProps {
    roles?: string[];
    permissions?: string[];
}

const AuthorizedRoute = ({ roles = [], permissions = [] }: AuthorizedRouteProps) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const isAdmin = useIsAdmin();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const hasRequiredRole =
        roles.length === 0 || (roles.includes("admin_system") && isAdmin);

    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default AuthorizedRoute;
