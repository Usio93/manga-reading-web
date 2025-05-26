import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalCommentControllerApiFactory } from "../../api/comment-service";
import {
    CommentReplyRequest,
    CommentRootRequest,
    ApiResponseCommentResponse,
    ApiResponseListCommentResponse,
} from "../../api/comment-service";
import { createPrivateServiceConfig } from "../../config/configuration";
import { privateAxios } from "../../config/axiosInstances";
import { showToast } from "../../utils/toast";

// ✅ Factory API có interceptor + token
const externalApi = ExternalCommentControllerApiFactory(
    createPrivateServiceConfig("comment"),
    undefined,
    privateAxios
);

// ✅ Tiện ích tái sử dụng invalidate + toast
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

// Tạo bình luận gốc
export const useCreateRootComment = (invalidateKeys: unknown[]) => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponseCommentResponse, Error, CommentRootRequest>({
        mutationFn: (data) =>
            externalApi.createRoot({ commentRootRequest: data }).then((res) => res.data),
        onSuccess: invalidateAndToast("Bình luận đã được tạo", queryClient, invalidateKeys),
    });
};

// Tạo phản hồi (reply)
export const useCreateReplyComment = (invalidateKeys: unknown[]) => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponseCommentResponse, Error, CommentReplyRequest>({
        mutationFn: (data) =>
            externalApi.createReply({ commentReplyRequest: data }).then((res) => res.data),
        onSuccess: invalidateAndToast("Phản hồi đã được gửi", queryClient, invalidateKeys),
    });
};

// Lấy danh sách phản hồi theo comment ID
export const useRepliesByCommentId = (commentId: string) => {
    return useQuery<ApiResponseListCommentResponse, Error>({
        queryKey: ["comments", "replies", commentId],
        queryFn: () => externalApi.getReplies({ id: commentId }).then((res) => res.data),
        enabled: !!commentId,
    });
};

// Cập nhật nội dung phản hồi
export const useUpdateReply = (invalidateKeys: unknown[]) => {
    const queryClient = useQueryClient();
    return useMutation<
        ApiResponseCommentResponse,
        Error,
        { id: string; data: CommentReplyRequest }
    >({
        mutationFn: ({ id, data }) =>
            externalApi.update({ id, commentReplyRequest: data }).then((res) => res.data),
        onSuccess: invalidateAndToast("Đã cập nhật bình luận", queryClient, invalidateKeys),
    });
};
