import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthHooks } from "../authService";

import { AuthenticateRequest } from "../../api/auth-service";


type AuthModalType = "login" | "register" | null;

export const useNavbarAuth = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, login, logout } = useAuthHooks();

    const [showModal, setShowModal] = useState<AuthModalType>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (username: string, password: string) => {
        try {
            setLoading(true);
            const payload: AuthenticateRequest = {
                username,
                password,
            };
            await login(payload);
            setShowModal(null);
            setError("");
            navigate("/");
        } catch {
            setError("Sai email hoặc mật khẩu!");
        } finally {
            setLoading(false);
        }
    };


    const handleLogout = async () => {
        await logout({});
        navigate("/");
    };

    return {
        user,
        isAuthenticated,
        showModal,
        setShowModal,
        handleLogin,
        handleLogout,
        error,
        loading,
    };
};
