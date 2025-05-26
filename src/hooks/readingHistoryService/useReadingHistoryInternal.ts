import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    InternalHistoryRecordControllerApi,
    RecordRequest,
    ApiResponseRecordResponse,
} from "../../api/readingHistory-service";
import { createPrivateServiceConfig } from "../../config/configuration";
import { privateAxios } from "../../config/axiosInstances";
import { showToast } from "../../utils/toast";

// ✅ Gọi đúng config + axios
const internalApi = new InternalHistoryRecordControllerApi(
    createPrivateServiceConfig("history"),
    undefined,
    privateAxios
);

export const useSaveReadingHistory = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponseRecordResponse["result"], Error, RecordRequest>({
        mutationFn: (payload) =>
            internalApi.saveRecord({ recordRequest: payload }).then((res) => res.data.result),
        onSuccess: () => {
            showToast("Đã lưu lịch sử đọc", "success");
            queryClient.invalidateQueries({ queryKey: ["reading-history"] });
        },
        onError: (error) => {
            console.error("Save error:", error);
            showToast("Lưu lịch sử đọc thất bại", "error");
        },
    });
};
