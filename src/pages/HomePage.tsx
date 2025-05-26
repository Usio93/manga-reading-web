import React from "react";
import Navbar from "../components/Navbar";

import MangaComponent from "../components/HomePage/MangaSection";
import MovingImages from "../components/HomePage/Movingimages";
import "../styles/HomePage/HomePage.scss";

const HomePage: React.FC = () => {
    return (
        <div className="container-big">
            <Navbar/>



            <div className="container-all">
                <MovingImages/>
                <MangaComponent />
            </div>

        </div>
    );
};

export default HomePage;
