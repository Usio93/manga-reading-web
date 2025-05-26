import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InternalChapterControllerApi, ChapterRequest } from "../../api/chapter-service";
import { showToast } from "../../utils/toast";
import { createPrivateServiceConfig } from "../../config/configuration";
import {privateAxios} from "../../config/axiosInstances";

const api = new InternalChapterControllerApi(
    createPrivateServiceConfig("chapter"),
    undefined,
    privateAxios
);

export const useCreateChapter = (bookId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ChapterRequest) =>
            api.createChapter({ bookId, chapterRequest: data }).then(res => res.data),
        onSuccess: () => {
            showToast("Tạo chapter thành công");
            queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
        },
    });
};

export const useUpdateChapter = (bookId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, chapterRequest }: { id: string; chapterRequest: ChapterRequest }) =>
            api.updateChapter({ id, chapterRequest }).then(res => res.data),
        onSuccess: () => {
            showToast("Cập nhật chapter thành công");
            queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
        },
    });
};

export const useDeleteChapter = (bookId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.deleteChapter({ id }).then(res => res.data),
        onSuccess: () => {
            showToast("Xoá chapter thành công");
            queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
        },
    });
};

export const useDeleteChaptersByBookId = (bookId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.deleteChaptersByBookId({ bookId }).then(res => res.data),
        onSuccess: () => {
            showToast("Đã xoá tất cả chapter của truyện");
            queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
        },
    });
};
