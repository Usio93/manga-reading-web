import { useFavouriteStore } from "./useFavouriteStore";
import { useAppSelector } from "../../store/hooks";
import { BookResponse } from "../../api/book-service";
import { useQueries } from "@tanstack/react-query";
import { createPublicServiceConfig } from "../../config/configuration";
import { publicAxios } from "../../config/axiosInstances";
import { ExternalBookAPIsApi } from "../../api/book-service";

export interface MangaItem {
    title: string;
    thumbnail: string;
}

const mapBookToMangaItem = (book: BookResponse): MangaItem => ({
    title: book.title ?? "Không rõ tiêu đề",
    thumbnail: book.coverUrl ?? "/fallback.jpg",
});

const externalApi = new ExternalBookAPIsApi(
    createPublicServiceConfig("book"),
    undefined,
    publicAxios
);

export const useFavouriteBooks = () => {
    const { bookIds } = useFavouriteStore();
    const { page, pageSize } = useAppSelector((state) => state.pagination.favorite);

    const paginatedIds = bookIds.slice(page * pageSize, (page + 1) * pageSize);

    const bookQueries = useQueries({
        queries: paginatedIds.map((id) => ({
            queryKey: ["book", id],
            queryFn: () => externalApi.getBookById({ id }).then(res => res.data),
            enabled: !!id,
        })),
    });

    const isLoading = bookQueries.some((q) => q.isLoading);

    const books = bookQueries
        .map((q) => q.data?.data)
        .filter((b): b is BookResponse => b !== undefined);

    const mangaItems: MangaItem[] = books.map(mapBookToMangaItem);

    return {
        isLoading,
        books,
        mangaItems,
    };
};