import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/GenresPage/Sidebar";
import "../styles/GenresPage/GenresPage.scss";
import Navbar from "../components/Navbar";
import { FaSearch} from "react-icons/fa";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";


import { useSearchByCategories } from "../hooks/searchService/useSearch";

const categories = [
     'Action', 'Adventure', 'Anime', 'Comedy', 'Comic', 'Cooking', 'Historical', 'Doujinshi', 'Drama', 'Fantasy', 'Isekai', 'Josei', 'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery', 'One Shot', 'Psychological', 'Romance', 'Samurai', 'School Life', 'Sci-Fi', 'Seinen', 'Shoujo', 'Shoujo Ai', 'Shounen', 'Shounen Ai', 'Slice of Life', 'Smut', 'Sports', 'Supernatural', 'Tragedy', 'Vampire', 'Webtoon', 'Reincarnation', 'Manhua', 'Manhwa',
    'Girls Love', 'Detective', 'Game', 'Humor', 'Thriller', 'Horror', 'Urban', 'Magic Realism', 'Superpower', 'Fantasy Romance', 'Time Travel', 'Post-Apocalyptic'
];

const GenresPage = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const visibleCategories = showAllCategories ? categories : categories.slice(0, 15);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const initialSelected = queryParams.get("categories")?.split(",") || [];
        setSelectedCategories(initialSelected);
    }, [location.search]);

    const toggleCategory = (category: string) => {
        if (category === 'All') {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(prev =>
                prev.includes(category)
                    ? prev.filter(c => c !== category)
                    : [...prev, category]
            );
        }
    };

    const handleSearch = () => {
        const query = selectedCategories.join(",");
        navigate(`/results/category?categories=${encodeURIComponent(query)}`);
    };

    const { data: searchData, isLoading } = useSearchByCategories(selectedCategories);
    const filteredComics = searchData?.data || [];

    return (
        <div className="container-main">
            <Navbar />
            <div className="container-genres">
                <div className="top-bar">
                    <div className="selected-tags">
                        {selectedCategories.map((cat, index) => (
                            <span key={index} className="tag">
                {cat}
                                <button className="remove-btn" onClick={() => toggleCategory(cat)}>×</button>
              </span>
                        ))}
                    </div>

                    <button
                        onClick={handleSearch}
                        className="search-button"
                        disabled={selectedCategories.length === 0}
                    >
                        <FaSearch />
                    </button>
                </div>

                <div className="left-panel">
                    <Sidebar
                        categories={visibleCategories}
                        selectedCategories={selectedCategories}
                        onToggleCategory={toggleCategory}
                    />

                    <button
                        onClick={() => setShowAllCategories(prev => !prev)}
                        className="toggle-categories-btn"
                    >
                        {showAllCategories ? 'Hide...' : 'Show more...'}
                    </button>
                </div>

                <div className="Genres">
                    <h2>
                        Boom!! <span>Each page is a door to a world that only those who dare to dream can enter.</span>
                    </h2>
                    {isLoading ? (
                        <p>Loading comics...</p>
                    ) : (
                        <div className="manga-list-genres">
                            {filteredComics.map((comic, index) => (
                                <div className="comic2" key={index}>
                                    <Link to={`/book/review/${comic.id}`}>
                                        <img src={comic.coverUrl} alt={comic.title} />
                                    </Link>
                                    <p className="name2">{comic.title}</p>
                                    <p className="sales2">
                                        {comic.author}{" "}
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>

                    </span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default GenresPage;
