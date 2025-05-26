import React, { useEffect, useState } from 'react';
import '../styles/BookReview.scss';
//import Navbar from "../components/Navbar";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

//import { useAuth } from '../hooks/authService/useAuth';
import { useGetBookById } from '../hooks/bookService/useBook';

import { useCheckIsFavourite, useAddBookToFavourite, useRemoveBookFromFavourite } from '../hooks/favouriteService/useFavourite';
import { useCheckBookmarkExists, useCreateBookmark, useDeleteBookmark } from '../hooks/bookmarkService/useBookmark';

import { useGetChaptersByBookId } from '../hooks/chapterService/usePublicChapter';




const BookReview: React.FC = () => {
    const navigate = useNavigate();

    const handleReadChapter = (chapterId: string) => {
        navigate(`/user/review/reading/${bookId}/${chapterId}`);
    };


    const { bookId } = useParams<{ bookId: string }>();
    //const { user } = useAuth();
   // const username = user?.username || '';
   // const userId = user?.userId || '';

    // 🟢 Lấy thông tin sách
    const { data: bookRes, isLoading: isBookLoading, error: bookError } = useGetBookById(bookId || '');
    const book = bookRes?.data;

    // 🟢 Lấy danh sách chương
    const { data: chapterRes, isLoading: isChapterLoading } = useGetChaptersByBookId(bookId || '');
    const chapters = chapterRes?.data || [];

    // ❤️ Yêu thích
  //  const { data: isFavourite } = useCheckIsFavourite(username, bookId || '');
    const addFavourite = useAddBookToFavourite();
    const removeFavourite = useRemoveBookFromFavourite();

  //  const handleToggleFavourite = () => {
    //    if (!username || !bookId) return;
      //  const payload = { username, bookId };
       // isFavourite
       //     ? removeFavourite.mutate(payload)
         //   : addFavourite.mutate(payload);
   // };

    // 🔖 Bookmark
  //  const numericUserId = Number(userId);
    const numericBookId = Number(bookId);
   // const { data: isBookmarked } = useCheckBookmarkExists(numericUserId, numericBookId);
    const createBookmark = useCreateBookmark();
    const deleteBookmark = useDeleteBookmark();

    //const handleToggleBookmark = () => {
      //  if (!numericUserId || !numericBookId) return;
       // const payload = { userId: numericUserId, bookId: numericBookId };
       // isBookmarked
          //  ? deleteBookmark.mutate(payload)
          //  : createBookmark.mutate(payload);
  //  };

    if (isBookLoading) return <div className="loading">Đang tải dữ liệu sách...</div>;
    if (bookError || !book) return <div className="error">❌ Không tìm thấy sách</div>;

    return (
        <div className="container-book-review">

            <div className="Reviewpage-big">
                <div className="story-detail-bg"></div>

                <div className="story-detail-card">
                    <div className="story-img-wrap">
                        <img className="story-img" src={book.coverUrl || "/img/default.jpg"} alt={book.title} />
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
                        {/*<div className="story-actions">
                            <button
                                className={`icon-btn ${isFavourite ? 'active' : ''}`}
                                onClick={handleToggleFavourite}
                                aria-label="Yêu thích"
                            >
                                {isFavourite ? <FaHeart color="red" size={24} /> : <FaRegHeart size={24} />}
                            </button>

                            <button
                                className={`icon-btn ${isBookmarked ? 'active' : ''}`}
                                onClick={handleToggleBookmark}
                                aria-label="Bookmark"
                            >
                                {isBookmarked ? <FaBookmark color="#007bff" size={24} /> :} <FaRegBookmark size={24} />}
                            </button>
                        </div>*/}
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
                        <div className="footer-links">
                            <a href="#">Giới thiệu</a>
                            <a href="#">Liên hệ</a>
                            <a href="#">Điều khoản</a>
                        </div>
                        <div className="footer-copy">&copy; 2025 LiteraryApp. All rights reserved.</div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default BookReview;
