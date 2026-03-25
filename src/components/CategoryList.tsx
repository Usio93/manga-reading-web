import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../mocks/categoryMocks";
import "../styles/CategoryList.scss";
interface CategoryListProps {
    scrolled?: boolean;
}


const CategoryList: React.FC<CategoryListProps> = ({ scrolled }) => {
    const categories = getCategories();
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();

    const handleCategoryClick = (categoryName: string) => {

        navigate(`/results/category?categories=${encodeURIComponent(categoryName)}`);
    };

    return (
        <div className="category-navbar">
            <div className={`category-list-navbar ${scrolled ? "scrolled" : ""}`}>
                <h1 className="section-title">Genres</h1>

                <div className="category-dropdown">
                    {categories.slice(0, 9).map((category) => (
                        <button
                            key={category.id}
                            className="category-item"
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            {category.name}
                        </button>
                    ))}

                    <button
                        className="category-item more-btn"
                        onClick={() => setShowMore(!showMore)}
                    >
                        {showMore ? "Hide..." : "Show more..."}
                    </button>
                </div>

                {showMore && (
                    <div className="category-dropdown expanded">
                        {categories.slice(9).map((category) => (
                            <button
                                key={category.id}
                                className="category-item"
                                onClick={() => handleCategoryClick(category.name)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryList;
