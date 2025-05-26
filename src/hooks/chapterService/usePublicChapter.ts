import { useQuery } from "@tanstack/react-query";
import { ExternalChapterAPIsApi } from "../../api/chapter-service";
import { createPublicServiceConfig } from "../../config/configuration";
import { publicAxios } from "../../config/axiosInstances";

const api = new ExternalChapterAPIsApi(
    createPublicServiceConfig("chapter"),
    undefined,
    publicAxios
);

export const useGetChaptersByBookId = (bookId: string) =>
    useQuery({
        queryKey: ["chapters", bookId],
        queryFn: () => api.getChaptersByBookId({ bookId }).then(res => res.data),
        enabled: !!bookId,
    });

export const useGetLastChapterByBookId = (bookId: string) =>
    useQuery({
        queryKey: ["chapter-last", bookId],
        queryFn: () => api.getLastChapterByBookId({ bookId }).then(res => res.data),
        enabled: !!bookId,
    });

export const useGetChapterByBookIdAndNumber = (bookId: string, chapterNumber: number) =>
    useQuery({
        queryKey: ["chapter", bookId, chapterNumber],
        queryFn: () => api.getChapterByBookIdAndNumber({ bookId, chapterNumber }).then(res => res.data),
        enabled: !!bookId && chapterNumber !== undefined,
    });

export const useGetChapterById = (bookId: string, chapterId: string) =>
    useQuery({
        queryKey: ["chapter", bookId, chapterId],
        queryFn: () => api.getChapterById({ bookId, chapterId }).then(res => res.data),
        enabled: !!bookId && !!chapterId,
    });

export const useCountChaptersByBookId = (bookId: string) =>
    useQuery({
        queryKey: ["chapter-count", bookId],
        queryFn: () => api.countChaptersByBookId({ bookId }).then(res => res.data),
        enabled: !!bookId,
    });