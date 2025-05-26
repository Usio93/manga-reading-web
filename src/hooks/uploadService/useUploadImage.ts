import { useMutation } from "@tanstack/react-query";
import { UploadControllerApi, ApiResponseUploadImageResponse } from "../../api/upload-service";
import { createPrivateServiceConfig } from "../../config/configuration";
import { privateAxios } from "../../config/axiosInstances";
import { showToast } from "../../utils/toast";

// ✅ Rõ ràng đây là API cần xác thực
const api = new UploadControllerApi(
    createPrivateServiceConfig("upload"),
    undefined,
    privateAxios
);

export const useUploadImage = () => {
    return useMutation<ApiResponseUploadImageResponse, Error, File>({
        mutationFn: (file) => api.uploadImage({ file }).then((res) => res.data),
        onError: (error) => showToast(error.message, "error"),
    });
};