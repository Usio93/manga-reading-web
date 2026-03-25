    import "../../styles/UserProfilePage/UserScrollListProfile.scss";
    import React from 'react';
    import { Link } from "react-router-dom";



    interface MangaItem {
        id: string;            // thêm id để dẫn link chính xác
        title: string;
        thumbnail: string;
    }

    interface Props {
        title: string;
        items: MangaItem[];
        index: number;
        onScroll: (direction: 'left' | 'right') => void;
    }

    const UserScrollList: React.FC<Props> = ({ title, items, index, onScroll }) => {
        const visibleCount = 6;

        const renderMangaList = () => {
            return items.slice(index, index + visibleCount).map((item, idx) => (
                <div className="scroll-item" key={idx}>
                    <Link to={`/book/review/${item.id}`}>
                        <div className="img-box">
                            <img src={item.thumbnail} alt={item.title} />
                        </div>
                    </Link>
                    <p>{item.title}</p>
                </div>
            ));
        };

        return (
            <div className="list-section">
                <h4>{title}</h4>
                <div className="scroll-wrapper">
                    <button className="circle-arrow" onClick={() => onScroll('left')}>
                        <span className="arrow-icon">‹</span>
                    </button>

                    <div className="scroll-list">{renderMangaList()}</div>

                    <button className="circle-arrow" onClick={() => onScroll('right')}>
                        <span className="arrow-icon">›</span>
                    </button>
                </div>
            </div>
        );
    };

    export default UserScrollList;
