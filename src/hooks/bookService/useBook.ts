import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ExternalBookAPIsApi,
    InternalBookControllerApi,
    ApiResponseBookResponse,
    ApiResponseVoid,
    ApiResponseListBookResponse,
    BookCreationRequest,
    BookRequest,
} from "../../api/book-service";
import { showToast } from "../../utils/toast";
import {
    createPrivateServiceConfig,
    createPublicServiceConfig,
} from "../../config/configuration";
import { privateAxios, publicAxios } from "../../config/axiosInstances";

const externalApi = new ExternalBookAPIsApi(
    createPublicServiceConfig("book"),
    undefined,
    publicAxios
);

// 🔐 Internal: requires token
const internalApi = new InternalBookControllerApi(
    createPrivateServiceConfig("book"),
    undefined,
    privateAxios
);

// ========== EXTERNAL ========== //

export const useGetAllBooks = () => {
    return useQuery<ApiResponseListBookResponse, Error>({
        queryKey: ["books"],
        queryFn: async (): Promise<ApiResponseListBookResponse> => {
            const res = await externalApi.getAllBooks();
            return res.data;
        },
    });
};

export const useGetBookById = (id: string) => {
    return useQuery<ApiResponseBookResponse, Error>({
        queryKey: ["book", id],
        queryFn: async () => {
            const res = await externalApi.getBookById({ id });
            return res.data;
        },
        enabled: !!id,
    });
};

export const useBooksByCreatedDate = () => {
    return useQuery({
        queryKey: ["books", "by-created-date"],
        queryFn: async () => {
            const res = await externalApi.getBooksOrderByCreatedDateDesc();
            return res.data?.data ?? [];
        },
    });
};


export const useBooksByViewCount = () => {
    return useQuery({
        queryKey: ["books", "by-view-count"],
        queryFn: async () => {
            const res = await externalApi.getBooksOrderByViewCountDesc();
            return res.data?.data ?? [];
        },
    });
};


// ========== INTERNAL ========== //

export const useCreateBook = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, BookCreationRequest>({
        mutationFn: (data) =>
            internalApi.createBook({ bookCreationRequest: data }).then((res) => res.data),
        onSuccess: () => {
            showToast("Tạo sách thành công!", "success");
            queryClient.invalidateQueries({ queryKey: ["books"] });
            queryClient.invalidateQueries({ queryKey: ["book"] });
        },
        onError: (err) => showToast(err.message, "error"),
    });
};

export const useUpdateBook = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponseBookResponse, Error, BookRequest>({
        mutationFn: (data) => internalApi.updateBook({ id, bookRequest: data }).then((res) => res.data),
        onSuccess: () => {
            showToast("Cập nhật sách thành công!", "success");
            queryClient.invalidateQueries({ queryKey: ["book", id] });
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: (err) => showToast(err.message, "error"),
    });
};

export const useDeleteBook = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponseVoid, Error>({
        mutationFn: () => internalApi.deleteBook({ id }).then((res) => res.data),
        onSuccess: () => {
            showToast("Xóa sách thành công!", "success");
            queryClient.invalidateQueries({ queryKey: ["books"] });
            queryClient.invalidateQueries({ queryKey: ["book", id] });
        },
        onError: (err) => showToast(err.message, "error"),
    });
};

export const useCheckBookExists = (bookId: string) => {
    return useQuery<boolean, Error>({
        queryKey: ["book-exists", bookId],
        queryFn: async () => {
            const res = await internalApi.checkBookExists({ bookId });
            return res.data.data ?? false;
        },
        enabled: !!bookId,
    });
};

// ✅ Raw function export để dùng cho useQueries
export const getBookByIdFn = async (id: string) => {
    const res = await externalApi.getBookById({ id });
    return res.data; // ✅ chỉ trả ApiResponseBookResponse
};
