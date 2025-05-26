import { useQuery } from "@tanstack/react-query";
import { HistoryRecordControllerApi } from "../../api/readingHistory-service";
import { createPrivateServiceConfig } from "../../config/configuration";
import { privateAxios } from "../../config/axiosInstances";
import { showToast } from "../../utils/toast";
import { mapPageRecordResponse, ReadingHistoryPage } from "../../utils/mappers";

// 🔐 Dùng đúng privateAxios
const api = new HistoryRecordControllerApi(
    createPrivateServiceConfig("history"),
    undefined,
    privateAxios
);

export const useGetReadingHistory = (
    userId: string,
    page = 0,
    size = 10
) => {
    return useQuery<ReadingHistoryPage>({
        queryKey: ["reading-history", userId, page, size],
        queryFn: async () => {
            try {
                const res = await api.getRecordByUserId({ userId, page, size });
                const result = res.data.result;
                if (!result) throw new Error("Không có dữ liệu");
                return mapPageRecordResponse(result);
            } catch (err) {
                showToast("Không thể tải lịch sử đọc", "error");
                throw err;
            }
        },
        enabled: !!userId,
        retry: 1,
    });
};