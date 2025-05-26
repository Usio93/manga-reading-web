
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import "../../styles/HomePage/MangaSection.scss";
import { Link } from "react-router-dom";
import { FaEye } from 'react-icons/fa';



import {
    useBooksByCreatedDate,
    useBooksByViewCount,
} from "../../hooks";

import React, { useMemo, useState } from "react";




interface Comic {
    coverUrl: string;
    title: string;
    author: string;
    views: number | string;
    id: string;
}

const ComicList: React.FC<{ comics: Comic[]; title: string }> = ({ comics, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 6;

    const handleNext = () => {
        if (currentIndex + itemsPerPage < comics.length) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const currentComics = comics.slice(currentIndex, currentIndex + itemsPerPage);

    return (
        <>
            <p className="text-gray">{title}</p>
            <div className="container2">
                {currentIndex > 0 && (
                    <div className="arrow1" onClick={handlePrev}><AiOutlineLeft /></div>
                )}

                {currentComics.map((comic, i) => (
                    <div className="comic2" key={i}>
                        <Link to={`/book/review/${comic.id}`}>
                            {comic.coverUrl ? (
                                <img src={comic.coverUrl} alt={comic.title} />
                            ) : (
                                <div className="placeholder-image">No Image</div>
                            )}
                        </Link>

                        <p className="name2">{comic.title}</p>
                        <p className="sales2">
                            {comic.author}
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <FaEye style={{ color: "#666" }} /> {comic.views}
                            </span>
                        </p>
                    </div>
                ))}

                {currentIndex + itemsPerPage < comics.length && (
                    <div className="arrow1" onClick={handleNext}><AiOutlineRight /></div>
                )}
            </div>
        </>
    );
};

// Component chính
const MangaComponent = () => {
    const {
        data: createdBooks,
        isLoading: loadingCreated,
        isError: errorCreated,
        error: createdError
    } = useBooksByCreatedDate();

    const {
        data: viewedBooks,
        isLoading: loadingViewed,
        isError: errorViewed,
        error: viewedError
    } = useBooksByViewCount();

    // Chuyển đổi dữ liệu từ API sang dạng Comic
    const mapBooksToComics = (books: any[] = []): Comic[] =>
        books.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author ?? "Unknown",
            views: book.viewCount ?? 0,
            coverUrl: book.coverUrl && book.coverUrl.trim() !== "" ? book.coverUrl : null,
        }));

    // ✅ Bảo vệ chống lỗi undefined
    const createdComics = useMemo(() => {
        if (!Array.isArray(createdBooks)) return [];
        return mapBooksToComics(createdBooks);
    }, [createdBooks]);

    const viewedComics = useMemo(() => {
        if (!Array.isArray(viewedBooks)) return [];
        return mapBooksToComics(viewedBooks);
    }, [viewedBooks]);

    // Loading UI
    if (loadingCreated || loadingViewed) return <div>Loading...</div>;

    // Error UI
    if (errorCreated || errorViewed) {
        return (
            <div style={{ color: "red", padding: "1rem" }}>
                <p>❌ Đã xảy ra lỗi khi tải dữ liệu.</p>
                {createdError && <p>Created: {(createdError as Error).message}</p>}
                {viewedError && <p>Viewed: {(viewedError as Error).message}</p>}
            </div>
        );
    }

    // ✅ Dự phòng nếu data bị undefined
    if (!Array.isArray(createdBooks) || !Array.isArray(viewedBooks)) {
        return <div>Dữ liệu không hợp lệ.</div>;
    }

    return (
        <div className="manga-section">
            <ComicList comics={viewedComics} title="Recommended Stories" />
            <ComicList comics={createdComics} title="Updated Stories" />
        </div>
    );
};

export default MangaComponent;
