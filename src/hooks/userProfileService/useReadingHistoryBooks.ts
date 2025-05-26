import { useQueries } from "@tanstack/react-query";
import { useGetUserReadingHistory } from "./useUserProfileHooks";
import { getBookByIdFn } from "../bookService";
import { useAppSelector } from "../../store/hooks";
import { useMemo } from "react";
import { BookResponse, ApiResponseBookResponse } from "../../api/book-service";

export interface MangaItem {
    title: string;
    thumbnail: string;
}

const mapBookToMangaItem = (book: BookResponse): MangaItem => ({
    title: book.title ?? "Không rõ tiêu đề",
    thumbnail: book.coverUrl ?? "/fallback.jpg",
});

export const useReadingHistoryBooks = (userId: string, limit = 12) => {
    const { data: history } = useGetUserReadingHistory(userId);
    const { page, pageSize } = useAppSelector((state) => state.pagination.readingHistory);

    const bookIds = useMemo(() => {
        if (!history) return [];
        const ids = history.map((item) => item.bookId).filter(Boolean) as string[];
        return [...new Set(ids)].slice(page * pageSize, (page + 1) * pageSize);
    }, [history, page, pageSize]);

    const bookQueries = useQueries({
        queries: bookIds.map((bookId) => ({
            queryKey: ["book", bookId],
            queryFn: () => getBookByIdFn(bookId),
            enabled: !!bookId,
        })),
    });

    const isLoading = bookQueries.some((q) => q.isLoading);

    const books = bookQueries
        .map((q) => q.data?.data)
        .filter((b): b is BookResponse => !!b);

    const mangaItems: MangaItem[] = books.map(mapBookToMangaItem);

    return {
        isLoading,
        books,
        mangaItems,
    };
};