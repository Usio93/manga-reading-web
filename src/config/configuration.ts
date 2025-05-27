import { Configuration } from "../api/auth-service";
import { store } from "../store";

const SERVICE_PATH_MAP: Record<string, string> = {
    book: "/book",
    auth: "/identity",
    bookmark: "/bookmark",
    chapter: "/chapter",
    comment: "/comment",
    crawl: "/crawl",
    upload: "/upload",
    wishlist: "/recommend",
    search: "/search",
    history: "/history",
    profile: "/profile",
    favourite: "/favourite",
};

// ⚠️ giữ lại cho tương thích cũ (nếu cần)
export const createServiceConfig = (service: keyof typeof SERVICE_PATH_MAP) =>
    createPrivateServiceConfig(service);

// ✅ config cho private API (có token)
export const createPrivateServiceConfig = (service: keyof typeof SERVICE_PATH_MAP) => {
    const baseGateway = import.meta.env.VITE_API_BASE_URL;
    const path = SERVICE_PATH_MAP[service];
    if (!path) throw new Error(`Unknown service key "${service}"`);

    return new Configuration({
        basePath: `${baseGateway}${path}`,
        accessToken: () => store.getState().auth.token || "",
        baseOptions: {
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        },
    });
};

// ✅ config cho public API (không token)
export const createPublicServiceConfig = (service: keyof typeof SERVICE_PATH_MAP) => {
    const baseGateway = import.meta.env.VITE_API_BASE_URL;
    const path = SERVICE_PATH_MAP[service];
    if (!path) throw new Error(`Unknown service key "${service}"`);

    return new Configuration({
        basePath: `${baseGateway}${path}`,
        baseOptions: {
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        },
    });
};
