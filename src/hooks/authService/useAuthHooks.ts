import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";
import { useLogin, useLogout, useRefreshToken, useIntrospectToken } from "./useAuth";
import { UserProfile } from "../../api/auth-service";
import { useMemo } from "react";

export const useAuthHooks = () => {
    const { mutateAsync: login } = useLogin();
    const { mutateAsync: logout } = useLogout();
    const refresh = useRefreshToken();
    const introspect = useIntrospectToken();

    const token = useAppSelector((state: RootState) => state.auth.token);
    const user = useAppSelector((state: RootState) => state.auth.user) as UserProfile | null;

    const isAuthenticated = !!token;

    return useMemo(
        () => ({
            login,
            logout,
            refresh,
            introspect,
            token,
            user,
            isAuthenticated,
        }),
        [login, logout, refresh, introspect, token, user, isAuthenticated]
    );
};