import { useMutation } from "@tanstack/react-query";
import { UploadControllerApi } from "../../api/upload-service";
import { ApiResponseCoverUploadResponse } from "../../api/upload-service";
import {
    createPrivateServiceConfig
} from "../../config/configuration";
import {
    privateAxios
} from "../../config/axiosInstances";
import { showToast } from "../../utils/toast";

const api = new UploadControllerApi(
    createPrivateServiceConfig("upload"),
    undefined,
    privateAxios
);

export const useUploadCover = () => {
    return useMutation<ApiResponseCoverUploadResponse, Error, { bookId: string; file: File }>({
        mutationFn: ({ bookId, file }) =>
            api.uploadCover({ bookId, file }).then((res) => res.data),
        onError: (error) => showToast(error.message, "error"),
    });
};