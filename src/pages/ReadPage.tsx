

import CommentSection from"../components/ReadPage/CommentSection";
import "../styles/ReadPage/ReadingPage.scss";
import Navbar from "../components/Navbar";





import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';



import { useGetChapterById, useGetChaptersByBookId } from "../hooks/chapterService/usePublicChapter";

const ReadingForm = () => {
    const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
    const navigate = useNavigate();


    // Gọi API lấy dữ liệu chương hiện tại
    const { data: chapterData, isLoading } = useGetChapterById(bookId || '', chapterId || '');

    // Gọi API lấy danh sách tất cả các chương trong truyện
    const { data: allChaptersData } = useGetChaptersByBookId(bookId || '');
    const chapters = allChaptersData?.data || [];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [chapterId]);

    if (!bookId || !chapterId) {
        return <div style={{ padding: '20px' }}>Thiếu bookId hoặc chapterId</div>;
    }

    if (isLoading) {
        return <div style={{ padding: '20px' }}>Đang tải chương...</div>;
    }

    if (!chapterData || !chapterData.data) {
        return <div style={{ padding: '20px' }}>Không tìm thấy chương.</div>;
    }

    const chapter = chapterData.data;

    // Tìm index chương hiện tại trong danh sách
    const currentIndex = chapters.findIndex((ch: any) => String(ch.id) === chapterId);
    const prevChapter = chapters[currentIndex - 1];
    const nextChapter = chapters[currentIndex + 1];

    const handleNavigateChapter = (targetChapterId: string) => {
        navigate(`/user/review/reading/${bookId}/${targetChapterId}`);
    };

    return (
        <div className="reading-container">
            <Navbar/>

            <div className="chapter-navigation-big">
                <div className="chapter-navigation">
                    <button
                        disabled={!prevChapter}
                        onClick={() => prevChapter && handleNavigateChapter(String(prevChapter.id))}
                    >
                        Previous
                    </button>

                    <select
                        value={chapterId}
                        onChange={(e) => handleNavigateChapter(e.target.value)}
                    >
                        {chapters.map((ch: any) => (
                            <option key={ch.id} value={ch.id}>
                                {ch.title}
                            </option>
                        ))}
                    </select>

                    <button
                        disabled={!nextChapter}
                        onClick={() => nextChapter && handleNavigateChapter(String(nextChapter.id))}
                    >
                        Next
                    </button>
                </div>

                <h2 className="chapter-title">{chapter.title}</h2>

                {Array.isArray(chapter.images) && chapter.images.length > 0 && (
                    <div className="chapter-image-gallery">
                        {chapter.images.map((imgUrl: string, idx: number) => (
                            <img
                                key={idx}
                                src={imgUrl}
                                alt={`Hình ảnh chương ${idx + 1}`}
                                className="chapter-image"
                            />
                        ))}
                    </div>
                )}

                {chapter.content && (
                    <div className="chapter-content">{chapter.content}</div>
                )}

                <CommentSection chapterId={chapter.id ? String(chapter.id) : ''} />



            </div>
        </div>
    );
};

export default ReadingForm;
