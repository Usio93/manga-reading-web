import { useMutation } from "@tanstack/react-query";
import { UploadControllerApi } from "../../api/upload-service";
import { ApiResponseAvatarUploadResponse } from "../../api/upload-service";
import { createPrivateServiceConfig } from "../../config/configuration";
import { privateAxios } from "../../config/axiosInstances";
import { showToast } from "../../utils/toast";

// ✅ Dùng đúng config và axios instance cho private API
const api = new UploadControllerApi(
    createPrivateServiceConfig("upload"),
    undefined,
    privateAxios
);

export const useUploadAvatar = () => {
    return useMutation<ApiResponseAvatarUploadResponse, Error, { userId: string; file: File }>({
        mutationFn: ({ userId, file }) =>
            api.uploadAvatar({ userId, file }).then((res) => res.data),
        onError: (error) => showToast(error.message, "error"),
    });
};
