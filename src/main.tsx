import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "./store";
import { queryClient } from "./config/reactQueryClient";

import { attachPrivateInterceptors } from "./config/axiosOpenApiInterceptor";
attachPrivateInterceptors();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                        <App />
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
