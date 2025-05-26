import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UserAPIApi } from "../../api/auth-service";
import {
    UserCreateRequest,
    UserUpdateRequest,
    ChangePasswordRequest,
    ApiResponseUserResponse,
    ApiResponseListUserResponse,
    ApiResponseChangePasswordResponse,
} from "../../api/auth-service";
import { createServiceConfig } from "../../config/configuration";
import { showToast } from "../../utils/toast";
import { useLogin } from "./useAuth";
import {
    createPublicServiceConfig,
    createPrivateServiceConfig,
} from "../../config/configuration";
import { publicAxios, privateAxios } from "../../config/axiosInstances";

// Dùng cho các API yêu cầu xác thực
const userApiPrivate = new UserAPIApi(
    createPrivateServiceConfig("auth"),
    undefined,
    privateAxios
);
const userApiPublic = new UserAPIApi(
    createPublicServiceConfig("auth"),
    undefined,
    publicAxios
);

const userApi = new UserAPIApi(createServiceConfig("auth"));

export const useRegister = () => {
    const navigate = useNavigate();
    const { mutateAsync: login } = useLogin();

    return useMutation<ApiResponseUserResponse, Error, UserCreateRequest>({
        mutationFn: (data) =>
            userApiPublic.createUser({ userCreateRequest: data }).then((res) => res.data),
        onSuccess: async (data, variables) => {
            showToast("Đăng ký thành công", "success");

            await login({
                username: variables.username,
                password: variables.password,
            });

            navigate("/");
        },
        onError: (err) => {
            showToast(err.message || "Đăng ký thất bại", "error");
        },
    });
};

export const useUserInfo = () => {
    return useQuery<ApiResponseUserResponse>({
        queryKey: ["user", "info"],
        queryFn: async () => {
            try {
                const res = await userApi.getInfo();
                return res.data;
            } catch (err) {
                showToast("Không lấy được thông tin người dùng", "error");
                throw err;
            }
        },
    });
};

export const useUserList = () => {
    return useQuery<ApiResponseListUserResponse>({
        queryKey: ["users"],
        queryFn: async () => {
            try {
                const res = await userApi.findAllUsers();
                return res.data;
            } catch (err) {
                showToast("Không lấy được danh sách người dùng", "error");
                throw err;
            }
        },
    });
};

export const useUserById = (userId: string) => {
    return useQuery<ApiResponseUserResponse>({
        queryKey: ["user", userId],
        queryFn: async () => {
            try {
                const res = await userApi.findUserById({ userId });
                return res.data;
            } catch (err) {
                showToast("Không tìm thấy người dùng", "error");
                throw err;
            }
        },
        enabled: !!userId,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<
        ApiResponseUserResponse,
        Error,
        { userId: string; userUpdateRequest: UserUpdateRequest }
    >({
        mutationFn: ({ userId, userUpdateRequest }) =>
            userApi.updateUser({ userId, userUpdateRequest }).then((res) => res.data),
        onSuccess: async () => {
            showToast("Cập nhật người dùng thành công", "success");
            await queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: () => {
            showToast("Cập nhật thất bại", "error");
        },
    });
};

export const useChangePassword = (userId: string) => {
    return useMutation<ApiResponseChangePasswordResponse, Error, ChangePasswordRequest>({
        mutationFn: (data) =>
            userApiPrivate.changePassword({
                userId,
                changePasswordRequest: data,
            }).then((res) => res.data),
        onSuccess: () => {
            showToast("Đổi mật khẩu thành công", "success");
        },
        onError: () => {
            showToast("Đổi mật khẩu thất bại", "error");
        },
    });
};