import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PermissionAPIApi } from "../../api/auth-service";
import {
    PermissionRequest,
    ApiResponseListPermissionResponse,
    ApiResponsePermissionResponse,
    ApiResponseVoid,
} from "../../api/auth-service";
import { createPrivateServiceConfig } from "../../config/configuration";
import { showToast } from "../../utils/toast";

// ✅ Dùng config private cho permission (thuộc auth-service)
const permissionApi = new PermissionAPIApi(createPrivateServiceConfig("auth"));

export const usePermissions = () => {
    const queryKey = ["permissions"] as const; // 👈 dùng `as const` để giữ kiểu tuple chuẩn

    return useQuery<
        ApiResponseListPermissionResponse, // TData
        Error,                             // TError
        ApiResponseListPermissionResponse, // TSelect
        typeof queryKey                    // TQueryKey
    >({
        queryKey,
        queryFn: () =>
            permissionApi.findAllPermissions().then((res) => res.data),

    });
};

export const useCreatePermission = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponsePermissionResponse, Error, PermissionRequest>({
        mutationFn: (data) =>
            permissionApi
                .createPermission({ permissionRequest: data })
                .then((res) => res.data),
        onSuccess: async () => {
            showToast("Tạo quyền thành công", "success");
            await queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
        onError: () => {
            showToast("Tạo quyền thất bại", "error");
        },
    });
};

export const useDeletePermission = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponseVoid, Error, string>({
        mutationFn: (permissionId) =>
            permissionApi
                .deletePermission({ permissionId })
                .then((res) => res.data),
        onSuccess: async () => {
            showToast("Xoá quyền thành công", "success");
            await queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
        onError: () => {
            showToast("Xoá quyền thất bại", "error");
        },
    });
};
