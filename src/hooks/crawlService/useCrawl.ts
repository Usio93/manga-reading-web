import { useMutation } from "@tanstack/react-query";
import { showToast } from "../../utils/toast";
import { createPrivateServiceConfig } from "../../config/configuration";
import { privateAxios } from "../../config/axiosInstances";
import { CrawlControllerApi } from "../../api/crawl-service";
import type { Metadata, CrawlResponse } from "../../api/crawl-service";

const crawlApi = new CrawlControllerApi(
    createPrivateServiceConfig("crawl"),
    undefined,
    privateAxios
);

export const useCrawl = () => {
    return useMutation<CrawlResponse, Error, Metadata>({
        mutationFn: async (metadata) => {
            const response = await crawlApi.crawl({ metadata });
            return response.data;
        },
        onError: (error) => {
            console.error("Crawl thất bại:", error);
            showToast("Không thể crawl dữ liệu. Vui lòng kiểm tra lại.", "error");
        },
        onSuccess: (data) => {
            if (!data.success) {
                showToast("Crawl không thành công. Kiểm tra lại dữ liệu.", "error");
                return;
            }
            showToast("Crawl thành công!", "success");
        },
    });
};
