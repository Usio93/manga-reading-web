import React from "react";
import { useLocation,  } from "react-router-dom";
import "../styles/GenresPage/ResultsPage.scss"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

import { useSearchByCategories } from "../hooks/searchService/useSearch";

const ResultsPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const rawCategories = queryParams.get("categories");
    const selectedCategories = rawCategories ? rawCategories.split(",").filter(Boolean) : [];


    const { data: searchData, isLoading } = useSearchByCategories(selectedCategories);
    const filteredComics = searchData?.data || [];

    return (
        <div className="container-category">
            <Navbar />
            <div className="Genres-results">
                <h2>
                    <span>{selectedCategories.join(", ") || "Tất cả truyện"}</span>
                </h2>
                <div className="manga-list-category">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : filteredComics.length > 0 ? (
                        filteredComics.map((comic, index) => (
                            <div className="comic3" key={index}>
                                <Link to={`/book/review/${comic.id}`}>
                                    <img src={comic.coverUrl} alt={comic.title} />
                                </Link>
                                <p className="name3">{comic.title}</p>
                                <p className="sales3">
                                    {comic.author}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No matching stories found</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ResultsPage;
