import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    BookmarkControllerApi,
    BookmarkRequest,
    ApiResponseBookmarkResponse,
    ApiResponseBoolean,
    ApiResponseListBookmarkResponse,
} from "../../api/bookmark-service";
import { showToast } from "../../utils/toast";
import { createPrivateServiceConfig } from "../../config/configuration";
import { privateAxios } from "../../config/axiosInstances";

const bookmarkApi = new BookmarkControllerApi(
    createPrivateServiceConfig("bookmark"),
    undefined,
    privateAxios
);

const QUERY_KEYS = {
    bookmarks: (userId: number) => ["bookmarks", userId],
    exists: (userId: number, bookId: number) => ["bookmark-exists", userId, bookId],
};

/**
 * 🔍 Lấy danh sách bookmark theo userId
 */
export const useGetBookmarksByUser = (userId: number, enabled = true) =>
    useQuery<ApiResponseListBookmarkResponse, Error>({
        queryKey: QUERY_KEYS.bookmarks(userId),
        queryFn: async () => {
            const res = await bookmarkApi.getBookmarksByUser({ userId });
            return res.data;
        },
        enabled,
    });

/**
 * ✅ Kiểm tra một user đã bookmark một book chưa
 */
export const useCheckBookmarkExists = (userId: number, bookId: number, enabled = true) =>
    useQuery<ApiResponseBoolean, Error>({
        queryKey: QUERY_KEYS.exists(userId, bookId),
        queryFn: async () => {
            const res = await bookmarkApi.existsBookmark({ userId, bookId });
            return res.data;
        },
        enabled,
    });

/**
 * ➕ Tạo mới bookmark
 */
export const useCreateBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiResponseBookmarkResponse, Error, BookmarkRequest>({
        mutationFn: async (bookmarkRequest) => {
            const res = await bookmarkApi.createBookmark({ bookmarkRequest });
            return res.data;
        },
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarks(variables.userId!) });
            showToast("Đã thêm bookmark");
        },
    });
};

/**
 * ❌ Xoá bookmark
 */
export const useDeleteBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation<unknown, Error, BookmarkRequest>({
        mutationFn: async (bookmarkRequest) => {
            const res = await bookmarkApi.deleteBookmark({ bookmarkRequest });
            return res.data;
        },
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarks(variables.userId!) });
            showToast("Đã xoá bookmark");
        },
    });
};