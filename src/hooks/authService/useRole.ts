import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoleAPIApi } from "../../api/auth-service";
import {
    RoleRequest,
    ApiResponseListRoleResponse,
    ApiResponseRoleResponse,
    ApiResponseVoid,
} from "../../api/auth-service";
import {
    createPrivateServiceConfig,
} from "../../config/configuration";
import { showToast } from "../../utils/toast";
import { privateAxios } from "../../config/axiosInstances";

const roleApi = new RoleAPIApi(
    createPrivateServiceConfig("auth"),

);

export const useRoles = () => {
    return useQuery<ApiResponseListRoleResponse>({
        queryKey: ["roles"],
        queryFn: async () => {
            try {
                const res = await roleApi.getAll();
                return res.data;
            } catch (err) {
                showToast("Không lấy được danh sách vai trò", "error");
                throw err;
            }
        },
    });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponseRoleResponse, Error, RoleRequest>({
        mutationFn: (data) => roleApi.create({ roleRequest: data }).then((res) => res.data),
        onSuccess: async () => {
            showToast("Tạo vai trò thành công", "success");
            await queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: () => {
            showToast("Tạo vai trò thất bại", "error");
        },
    });
};

export const useDeleteRole = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponseVoid, Error, string>({
        mutationFn: (role) => roleApi._delete({ role }).then((res) => res.data),
        onSuccess: async () => {
            showToast("Xoá vai trò thành công", "success");
            await queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: () => {
            showToast("Xoá vai trò thất bại", "error");
        },
    });
};
