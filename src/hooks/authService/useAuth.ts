import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { AuthenticationAPIApi } from "../../api/auth-service";
import {
    AuthenticateRequest,
    RefreshRequest,
    LogoutRequest,
    IntrospectTokenRequest,
    ApiResponseAuthenticateResponse,
    ApiResponseIntrospectTokenResponse,
    ApiResponseVoid,
    UserResponse,
} from "../../api/auth-service";
import { createPublicServiceConfig, createPrivateServiceConfig } from "../../config/configuration";
import { publicAxios, privateAxios } from "../../config/axiosInstances";
import { loginSuccess, logout, updateAccessToken } from "../../store/slices/authSlice";
import { showToast } from "../../utils/toast";

const authApiPublic = new AuthenticationAPIApi(
    createPublicServiceConfig("auth"),
undefined,
    publicAxios
);

const authApiPrivate = new AuthenticationAPIApi(
    createPrivateServiceConfig("auth"),
    undefined,
    privateAxios
);


export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return useMutation<ApiResponseAuthenticateResponse, Error, AuthenticateRequest>({
        mutationFn: (data) =>
            authApiPublic.authenticate({ authenticateRequest: data }).then((res) => res.data),
        onSuccess: (res, variables) => {
            const token = res.result?.token;
            const authenticated = res.result?.authenticated;

            if (!token || !authenticated) {
                showToast("Đăng nhập thất bại", "error");
                return;
            }

            const user: UserResponse = {
                userId: "",
                profileId: "",
                username: variables.username ?? "",
                email: "",
                password: "",
                createdAt: "",
            };

            dispatch(loginSuccess({ token, refreshToken: "", user }));
            showToast("Đăng nhập thành công", "success");
            navigate("/");
        },
        onError: () => showToast("Đăng nhập thất bại", "error"),
    });
};

export const useRefreshToken = () => {
    const dispatch = useDispatch();

    return useMutation<ApiResponseAuthenticateResponse, Error, RefreshRequest>({
        mutationFn: (data) =>
            authApiPrivate.authenticate1({ refreshRequest: data }).then((res) => res.data),
        onSuccess: (res) => {
            const token = res.result?.token;
            if (token) {
                dispatch(updateAccessToken(token));
                localStorage.setItem("token", token);
            } else {
                showToast("Không lấy được token mới", "error");
            }
        },
        onError: () => showToast("Làm mới token thất bại", "error"),
    });
};

export const useLogout = () => {
    const dispatch = useDispatch();

    return useMutation<ApiResponseVoid, Error, LogoutRequest>({
        mutationFn: (data) =>
            authApiPrivate.logout({ logoutRequest: data }).then((res) => res.data),
        onSuccess: () => {
            dispatch(logout());
            showToast("Đã đăng xuất", "success");
        },
        onError: () => showToast("Đăng xuất thất bại", "error"),
    });
};

export const useIntrospectToken = () => {
    return useMutation<ApiResponseIntrospectTokenResponse, Error, IntrospectTokenRequest>({
        mutationFn: (data) =>
            authApiPublic.introspectToken({ introspectTokenRequest: data }).then((res) => res.data),
        onSuccess: (res) => {
            const valid = res.result?.valid;
            showToast(valid ? "Token hợp lệ" : "Token không hợp lệ", valid ? "success" : "error");
        },
        onError: () => showToast("Xác thực token thất bại", "error"),
    });
};

export const useAuth = () => {
    const loginMutation = useLogin();
    const logoutMutation = useLogout();
    const refreshMutation = useRefreshToken();
    const introspectMutation = useIntrospectToken();
    const user = useSelector((state: RootState) => state.auth.user);
    const isAuthenticated = !!user;

    return {
        user,
        isAuthenticated,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        refresh: refreshMutation.mutateAsync,
        introspect: introspectMutation.mutateAsync,
    };
};