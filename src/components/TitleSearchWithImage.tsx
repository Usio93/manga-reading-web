import "../styles/TitleSearchWithImage.scss";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { SearchBookItem } from "../utils/mappers";

interface Props {
    books: SearchBookItem[];
    search: string;
    isLoading?: boolean;
    onSelect: () => void;
}

const SearchDropdown: React.FC<Props> = ({ books, search, isLoading, onSelect }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const trimmedSearch = search.trim();

    // Không render gì nếu chưa nhập hoặc chỉ khoảng trắng
    if (trimmedSearch.length === 0) return null;

    // Hiển thị spinner nếu đang loading
    if (isLoading) {
        return (
            <div className={`search-results-dropdown ${isScrolled ? "scrolled" : ""}`}>
                <div className="search-loading">🔄 Đang tìm kiếm...</div>
            </div>
        );
    }

    // Không có kết quả sau khi load xong → không render
    if (books.length === 0) return null;

    return (
        <div className={`search-results-dropdown ${isScrolled ? "scrolled" : ""}`}>
            {books.map((book) => (
                <Link
                    to={`/book/review/${book.id}`}
                    className="search-result-item"
                    key={book.id}
                    onClick={onSelect}
                >
                    <img src={book.image} alt={book.title} />
                    <span>{book.title}</span>
                </Link>
            ))}
        </div>
    );
};

export default SearchDropdown;
