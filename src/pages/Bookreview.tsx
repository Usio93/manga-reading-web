import React, { useEffect, useState } from 'react';
import '../styles/BookReview.scss';
import Navbar from "../components/Navbar";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { useAuth } from '../hooks/authService/useAuth';
import { useGetBookById } from '../hooks/bookService/useBook';

import {  useAddBookToFavourite, useRemoveBookFromFavourite } from '../hooks/favouriteService/useFavourite';


import { useGetChaptersByBookId } from '../hooks/chapterService/usePublicChapter';



import { useQueryClient } from '@tanstack/react-query';




const BookReview: React.FC = () => {
    const navigate = useNavigate();
    const { bookId } = useParams<{ bookId: string }>();
    const { user } = useAuth();
    const username = user?.username || '';
    const queryClient = useQueryClient();

    const { data: bookRes, isLoading: isBookLoading, error: bookError } = useGetBookById(bookId || '');
    const book = bookRes?.data;

    const { data: chapterRes, isLoading: isChapterLoading } = useGetChaptersByBookId(bookId || '');
    const chapters = chapterRes?.data || [];

    const addFavourite = useAddBookToFavourite();

    const [isFavourite, setIsFavourite] = useState(false);
    const [isMutating, setIsMutating] = useState(false);

    useEffect(() => {
        const rawBook = book as any;
        if (rawBook && typeof rawBook.isFavourite === 'boolean') {
            setIsFavourite(rawBook.isFavourite);
        }
    }, [book]);

    const handleAddFavourite = async () => {
        if (!username || !bookId || isMutating || isFavourite) return;

        const payload = { username, bookId };
        setIsMutating(true);

        try {
            await addFavourite.mutateAsync(payload);
            setIsFavourite(true);
            queryClient.invalidateQueries({ queryKey: ['favourite'] });
        } catch (error) {
            console.error('Error adding to favorites:', error);
        } finally {
            setIsMutating(false);
        }
    };

    const handleReadChapter = (chapterId: string) => {
        navigate(`/user/review/reading/${bookId}/${chapterId}`);
    };

    if (isBookLoading) return <div className="loading">Loading book data...</div>;
    if (bookError || !book) return <div className="error">❌ No books found</div>;

    return (
        <div className="container-book-review">
            <Navbar />

            <div className="Reviewpage-big">
                <div className="story-detail-bg"></div>

                <div className="story-detail-card">
                    <div className="story-img-wrap">
                        <img
                            className="story-img"
                            src={book.coverUrl || "/img/default.jpg"}
                            alt={book.title}
                        />
                    </div>
                    <div className="story-info-main">
                        <div className="story-title">{book.title}</div>
                        <div className="story-author">Tác giả: {book.author}</div>
                        <div className="story-tags">
                            {(book.categories || []).map((cat, index) => (
                                <div className="story-tag" key={index}>{cat}</div>
                            ))}
                        </div>
                        <div className="story-summary-label">Mô tả</div>
                        <div className="story-summary">{book.description}</div>

                        <div className="story-actions">
                            <button
                                className={`icon-btn ${isFavourite ? 'active' : ''}`}
                                onClick={handleAddFavourite}
                                aria-label="Yêu thích"
                                disabled={isMutating || isFavourite}
                            >
                                {isFavourite
                                    ? <FaHeart color="red" size={24} />
                                    : <FaRegHeart size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                <section className="chapter-section">
                    <div className="chapter-section-title">Chương</div>
                    <div className="chapter-list-scroll" role="list">
                        {isChapterLoading ? (
                            <div>Đang tải chương...</div>
                        ) : chapters.length === 0 ? (
                            <div>Không có chương nào</div>
                        ) : (
                            chapters.map((chapter) => {
                                if (!chapter.id || !chapter.title) return null;
                                const chapterId = String(chapter.id);
                                return (
                                    <button
                                        key={chapter.id}
                                        className="chapter-card"
                                        role="listitem"
                                        onClick={() => handleReadChapter(chapterId)}
                                    >
                                        {chapter.title}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </section>

                <footer className="footer">
                    <div className="footer-content">

                        <div className="footer-copy">&copy; 2025 LiteraryApp. All rights reserved.</div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default BookReview;
