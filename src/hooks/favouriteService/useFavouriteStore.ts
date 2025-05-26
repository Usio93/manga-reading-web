import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { useCallback } from "react";
import { addFavourite, removeFavourite } from "../../store/slices/favouriteSlice";

export const useFavouriteStore = () => {
    const dispatch = useDispatch();
    const bookIds = useSelector((state: RootState) => state.favourite.bookIds);

    const isFavourite = useCallback(
        (bookId: string) => bookIds.includes(bookId),
        [bookIds]
    );

    const toggleFavourite = useCallback(
        (bookId: string) => {
            if (isFavourite(bookId)) {
                dispatch(removeFavourite(bookId));
            } else {
                dispatch(addFavourite(bookId));
            }
        },
        [dispatch, isFavourite]
    );

    return {
        bookIds,
        isFavourite,
        toggleFavourite,
    };
};