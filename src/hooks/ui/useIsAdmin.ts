import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export const useIsAdmin = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    return user?.username === "admin_system";
};