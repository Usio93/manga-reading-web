import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentControllerApi } from "../../api/comment-service/apis/comment-controller-api";
import {
    CommentRequest,
    ApiResponseCommentResponse,
    ApiResponseListCommentResponse,
} from "../../api/comment-service";
import {
    createPublicServiceConfig,
    createPrivateServiceConfig,
} from "../../config/configuration";
import { publicAxios, privateAxios } from "../../config/axiosInstances";
import { showToast } from "../../utils/toast";

// 🔓 Public API client – không cần token
const publicApi = new CommentControllerApi(
    createPublicServiceConfig("comment"),
    undefined,
    publicAxios

);

// 🔐 Private API client – có token + interceptor
const privateApi = new CommentControllerApi(
    createPrivateServiceConfig("comment"),
    undefined,
    privateAxios

);

// ✅ Reuse hàm tiện ích invalidate + toast
const invalidateAndToast = (
    message: string,
    queryClient: ReturnType<typeof useQueryClient>,
    keys: unknown[]
) => {
    return () => {
        showToast(message);
        queryClient.invalidateQueries({ queryKey: keys });
    };
};

// 🔍 Lấy comment theo Book ID (public)
export const useCommentsByBookId = (bookId: number) => {
    return useQuery<ApiResponseListCommentResponse, Error>({
        queryKey: ["comments", "book", bookId],
        queryFn: () => publicApi.getByBookId({ bookId }).then((res) => res.data),
        enabled: !!bookId,
    });
};

// 🔍 Lấy comment theo Chapter ID (public)
export const useCommentsByChapterId = (chapterId: number) => {
    return useQuery<ApiResponseListCommentResponse, Error>({
        queryKey: ["comments", "chapter", chapterId],
        queryFn: () => publicApi.getByChapterId({ chapterId }).then((res) => res.data),
        enabled: !!chapterId,
    });
};

// ✍️ Tạo comment (private)
export const useCreateComment = (invalidateKeys: unknown[]) => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponseCommentResponse, Error, CommentRequest>({
        mutationFn: (data) =>
            privateApi.create({ commentRequest: data }).then((res) => res.data),
        onSuccess: invalidateAndToast("Bình luận đã được gửi", queryClient, invalidateKeys),
        onError: (error) => {
            showToast(`Gửi bình luận thất bại: ${error.message}`, "error");
        },
    });
};

// ❌ Xoá comment (private)
export const useDeleteComment = (invalidateKeys: unknown[]) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: (id) => privateApi._delete({ id }).then(() => undefined),
        onSuccess: invalidateAndToast("Đã xoá bình luận", queryClient, invalidateKeys),
    });
};
