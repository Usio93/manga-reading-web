import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    BookSearchingControllerApi,
    BookIndexControllerApi,
    BookIndexUpdateRequest,
    ApiResponseListBookSearchingResult,
    ApiResponseBookIndexResponse,
} from "../../api/search-service";
import {
    createPublicServiceConfig,
    createPrivateServiceConfig,
} from "../../config/configuration";
import { publicAxios, privateAxios } from "../../config/axiosInstances";
import { showToast } from "../../utils/toast";

// 🌐 Searching API (public)
const searchingApi = new BookSearchingControllerApi(
    createPublicServiceConfig("search"),
    undefined,
    publicAxios
);

// 🔐 Indexing API (private)
const indexingApi = new BookIndexControllerApi(
    createPrivateServiceConfig("search"),
    undefined,
    privateAxios
);

// ---------- PUBLIC HOOKS ----------

export const useAutocompleteTitle = (prefix: string) => {
    return useQuery<ApiResponseListBookSearchingResult, Error>({
        queryKey: ["autocomplete-title", prefix],
        queryFn: () => searchingApi.autocompleteTitle({ prefix }).then((res) => res.data),
        enabled: prefix.trim().length > 0,
    });
};

export const useSearchByTitle = (title: string) => {
    return useQuery<ApiResponseListBookSearchingResult, Error>({
        queryKey: ["search-title", title],
        queryFn: () => searchingApi.getBookByTitle({ title }).then((res) => res.data),
        enabled: title.trim().length > 0,
    });
};

export const useSearchByAuthor = (author: string) => {
    return useQuery<ApiResponseListBookSearchingResult, Error>({
        queryKey: ["search-author", author],
        queryFn: () => searchingApi.getBooksByAuthor({ author }).then((res) => res.data),
        enabled: author.trim().length > 0,
    });
};

export const useSearchByCategories = (categories: string[]) => {
    return useQuery<ApiResponseListBookSearchingResult, Error>({
        queryKey: ["search-categories", categories],
        queryFn: () => searchingApi.getBookByCategories({ categories }).then((res) => res.data),
        enabled: categories.length > 0,
    });
};

export const useGetAllSearchResults = () => {
    return useQuery<ApiResponseListBookSearchingResult, Error>({
        queryKey: ["search-all"],
        queryFn: () => searchingApi.getAll().then((res) => res.data),
    });
};

// ---------- PRIVATE HOOKS ----------

export const useUpdateBookIndex = () => {
    const queryClient = useQueryClient();

    return useMutation<
        ApiResponseBookIndexResponse,
        Error,
        BookIndexUpdateRequest
    >({
        mutationFn: (data) =>
            indexingApi.updateBook({ bookIndexUpdateRequest: data }).then((res) => res.data),
        onSuccess: () => {
            showToast("Cập nhật index thành công", "success");
            queryClient.invalidateQueries({ queryKey: ["search-all"] });
        },
        onError: () => {
            showToast("Cập nhật index thất bại", "error");
        },
    });
};
