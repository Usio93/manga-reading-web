import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { showToast } from "../../utils/toast";
import { AxiosError } from "axios";
import {
    BookAddRequest,
    BookRemoveRequest,
    ExternalAPIForFavouriteServiceApi,
    InternalAPIForFavouriteServiceApi,
} from "../../api/favourite-service";
import {
    createPublicServiceConfig,
    createPrivateServiceConfig,
} from "../../config/configuration";
import { publicAxios, privateAxios } from "../../config/axiosInstances";
import {
    setFavouriteBookIds,
    addFavourite,
    removeFavourite,
    clearFavourite,
} from "../../store/slices/favouriteSlice";

const externalApi = new ExternalAPIForFavouriteServiceApi(
    createPublicServiceConfig("favourite"),
    undefined,
    publicAxios
);

const internalApi = new InternalAPIForFavouriteServiceApi(
    createPrivateServiceConfig("favourite"),
    undefined,
    privateAxios
);

const FAVOURITE_KEY = "favourite";

// External: Get count of favourites for a book
export const useGetFavouriteCount = (bookId: string) =>
    useQuery({
        queryKey: [FAVOURITE_KEY, "count", bookId],
        queryFn: () =>
            externalApi.getCountByBookId({ bookId }).then((res) => res.data.result),
        enabled: !!bookId,
    });

// Internal: Get favourite list by user and sync to Redux
export const useGetFavouriteListByUser = (username: string) => {
    const dispatch = useDispatch();

    const query = useQuery({
        queryKey: [FAVOURITE_KEY, "list", username],
        queryFn: async () => {
            const res = await internalApi.getFavouriteListByUserId({ username });
            return res.data.result ?? [];
        },
        enabled: !!username,
    });

    useEffect(() => {
        if (query.data) {
            const ids = query.data
                .map((f: { bookId?: string }) => f.bookId)
                .filter(Boolean) as string[];
            dispatch(setFavouriteBookIds(ids));
        }
    }, [query.data, dispatch]);

    return query;
};

// Internal: Check if book is favourite (không dùng slice)
export const useCheckIsFavourite = (username: string, bookId: string) =>
    useQuery({
        queryKey: [FAVOURITE_KEY, "check", username, bookId],
        queryFn: () =>
            internalApi.isFavourite({ username, bookId }).then((res) => res.data.result),
        enabled: !!username && !!bookId,
    });

// Internal: Add book to favourite + update Redux
export const useAddBookToFavourite = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: (data: BookAddRequest) =>
            internalApi.addBookToFavourite({ bookAddRequest: data }),
        onSuccess: (_, variables) => {
            showToast("✅ Đã thêm vào danh sách yêu thích");
            if (variables.bookId) {
                dispatch(addFavourite(variables.bookId));
            }
            queryClient.invalidateQueries({ queryKey: [FAVOURITE_KEY] });
        },
        onError: (err: AxiosError) => {
            const msg = (err.response?.data as { message?: string })?.message;
            showToast(msg || "Thêm yêu thích thất bại", "error");
        },
    });
};

// Internal: Remove book from favourite + update Redux
export const useRemoveBookFromFavourite = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: (data: BookRemoveRequest) =>
            internalApi.removeBookFromFavourite({ bookRemoveRequest: data }),
        onSuccess: (_, variables) => {
            showToast("🗑️ Đã xóa khỏi danh sách yêu thích");
            if (variables.bookId) {
                dispatch(removeFavourite(variables.bookId));
            }
            queryClient.invalidateQueries({ queryKey: [FAVOURITE_KEY] });
        },
        onError: (err: AxiosError) => {
            const msg = (err.response?.data as { message?: string })?.message;
            showToast(msg || "Xóa yêu thích thất bại", "error");
        },
    });
};

// Internal: Remove all favourites by user + clear Redux
export const useRemoveAllFavouritesByUser = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: (username: string) =>
            internalApi.removeAllFavouritesByUser({ username }),
        onSuccess: () => {
            showToast("🧹 Đã xóa toàn bộ sách yêu thích của người dùng");
            dispatch(clearFavourite());
            queryClient.invalidateQueries({ queryKey: [FAVOURITE_KEY] });
        },
        onError: (err: AxiosError) => {
            const msg = (err.response?.data as { message?: string })?.message;
            showToast(msg || "Lỗi xóa toàn bộ sách yêu thích", "error");
        },
    });
};

// Internal: Remove all favourites by book (không update slice vì không biết user)
export const useRemoveAllFavouritesByBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookId: string) =>
            internalApi.removeAllFavouritesByBookId({ bookId }),
        onSuccess: () => {
            showToast("🧹 Đã xóa toàn bộ người dùng yêu thích cuốn sách này");
            queryClient.invalidateQueries({ queryKey: [FAVOURITE_KEY] });
        },
        onError: (err: AxiosError) => {
            const msg = (err.response?.data as { message?: string })?.message;
            showToast(msg || "Lỗi xóa sách yêu thích", "error");
        },
    });
};