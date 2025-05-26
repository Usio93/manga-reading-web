import React, { useEffect, useState } from "react";
import "../../styles/HomePage/MovingImages.scss";
import { Link } from "react-router-dom";

import { useGetAllBooks } from "../../hooks/bookService/useBook";
import defaultAvatars from "../../assets/default_avatar.jpg";

const MovingImages = () => {
    const { data, isLoading, error } = useGetAllBooks();
    const [currentIndex, setCurrentIndex] = useState(0);


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const rawBooks = data?.data || [];
    console.log("Danh sách sách:", rawBooks);

    const mappedBooks = rawBooks.map((book) => ({
        id: book.id,
        title: book.title,
        description: book.description ?? "Chưa có mô tả.",
        previewImages: book.coverUrl ? [book.coverUrl] : [defaultAvatars],
        tags: book.categories ?? [],
        episodes: `${book.chapterCount}/?`,
        Images: book.coverUrl ? [book.coverUrl] : [defaultAvatars],
    }));
    console.log("Dữ liệu sách:", data);
    const topFiveBooks = mappedBooks.slice(0, 5);
    const currentData = topFiveBooks[currentIndex];




    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === topFiveBooks.length - 1 ? 0 : prev + 1
            );
        }, 10000);
        return () => clearInterval(interval);
    }, [topFiveBooks.length]);



    if (!currentData || !currentData.previewImages || currentData.previewImages.length === 0) {
        return <div>No preview available</div>;
    }

    return (
        <div id="content-container">
            <div id="recommendation">
                <div className="recommendation-header">
                    <div className="recommendation-title">
                        <h2>Recommended for you</h2>
                        <p>Choose your favorite!</p>
                    </div>
                    <div className="recommendation-background">
                        <img
                            src={currentData.previewImages[0]}

                            alt="Background"

                            className="image-card"
                        />
                    </div>
                </div>
                <div className="recommendation-card">
                    <h3>{currentData.title}</h3>
                    <div className="recommendation-tags">
                        {currentData.tags.map((tag: string, i: number) => (
                            <span key={i}>{tag}</span>
                        ))}
                    </div>
                    <div className="rating">
                        <span>⏳ {currentData.episodes}</span>
                    </div>

                    <div className="recommendation-divider"></div>
                    <p className="recommendation-description">{currentData.description}</p>

                    <div className="gap">
                        {mappedBooks.slice(0, 5).map((book, i) => (
                            <div
                                className={`image-container-baby ${i === currentIndex ? 'active' : ''}`}
                                key={book.id}
                                onClick={() => setCurrentIndex(i)}
                            >
                                <img src={book.previewImages[0]} alt={`Book ${i + 1}`}/>
                            </div>
                        ))}
                    </div>


                    <div className="image-container">
                        <Link to={`/book/review/${currentData.id}`}>
                            <img
                                src={currentData.previewImages[0] || defaultAvatars}
                                alt="Main Preview"
                                className="image-card"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovingImages;
