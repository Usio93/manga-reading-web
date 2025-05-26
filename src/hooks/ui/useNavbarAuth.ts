import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthHooks } from "../authService";
import { showToast } from "../../utils/toast";

import { AuthenticateRequest } from "../../api/auth-service";


type AuthModalType = "login" | "register" | null;

export const useNavbarAuth = () => {
    const navigate = useNavigate();
    const {
        user,
        token,
        isAuthenticated,
        login,
        logout,
    } = useAuthHooks();

    const [showModal, setShowModal] = useState<AuthModalType>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (username: string, password: string) => {
        try {
            setLoading(true);
            const payload: AuthenticateRequest = { username, password };
            await login(payload);
            setShowModal(null);
            setError("");
            navigate("/");
        } catch {
            setError("Sai email hoặc mật khẩu!");
            showToast("Sai email hoặc mật khẩu!", "error");
        } finally {
            setLoading(false);
        }
    };


    const handleLogout = async () => {
        if (!token) {
            showToast("Không tìm thấy token để đăng xuất", "error");
            return;
        }
        try {
            await logout({ token });
            navigate("/");
        } catch {
            showToast("Đăng xuất thất bại", "error");
        }
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
