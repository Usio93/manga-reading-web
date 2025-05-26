import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface PaginationInfo {
    page: number;
    pageSize: number;
}

interface PaginationState {
    readingHistory: PaginationInfo;
    comment: PaginationInfo;
    favorite: PaginationInfo;
}

const initialState: PaginationState = {
    readingHistory: { page: 0, pageSize: 6 },
    comment: { page: 0, pageSize: 10 },
    favorite: { page: 0, pageSize: 6 },
};

const paginationSlice = createSlice({
    name: "pagination",
    initialState,
    reducers: {
        setPage(
            state,
            action: PayloadAction<{ type: keyof PaginationState; page: number }>
        ) {
            const { type, page } = action.payload;
            state[type].page = page;
        },
        setPageSize(
            state,
            action: PayloadAction<{ type: keyof PaginationState; size: number }>
        ) {
            const { type, size } = action.payload;
            state[type].pageSize = size;
        },
    },
});

export const { setPage, setPageSize } = paginationSlice.actions;

export default paginationSlice.reducer;

// ✅ Selectors (gợi ý dùng)
export const selectReadingHistoryPagination = (state: RootState) =>
    state.pagination.readingHistory;

export const selectCommentPagination = (state: RootState) =>
    state.pagination.comment;

export const selectFavoritePagination = (state: RootState) =>
    state.pagination.favorite;
