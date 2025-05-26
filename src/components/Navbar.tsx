import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import SearchDropdown from "../components/TitleSearchWithImage";
import { useDebounce } from "use-debounce";
import AuthModal from "./HomePage/AuthModal";
import CategoryList from "./CategoryList";

import "../styles/Navbar.scss";

import logo from "../assets/logo-black.png";
import { useSearchByKeyword, useNavbarAuth } from "../hooks";
import { mapSearchResultToBookItem } from "../utils/mappers";
import defaultAvatar from "../assets/default_avatar.jpg";

const Navbar: React.FC = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 300);
    const trimmedSearch = debouncedSearch.trim();
    const showSearch = trimmedSearch.length > 0;

    const { data: mergedResult, isLoading } = useSearchByKeyword(showSearch ? trimmedSearch : "");
    const books = (mergedResult || []).map(mapSearchResultToBookItem);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const {
        user,
        isAuthenticated,
        showModal,
        setShowModal,
        handleLogin,
        handleLogout,
        error,
        loading,
    } = useNavbarAuth();

    return (
        <>
            <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
                <div className="container">
                    <Link to="/">
                        <img src={logo} alt="FREEREA" className="logo" />
                    </Link>

                    <ul className="navbar_menu">
                        <div
                            className="category-wrapper-navbar"
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                            ref={dropdownRef}
                        >
                            <li>
                                <Link to="/genres" className="menu-item">Genres</Link>
                                <div className={`category_menu ${showDropdown ? "show" : ""}`}>
                                    <CategoryList scrolled={scrolled} />
                                </div>
                            </li>
                        </div>
                        <li><Link to="/admin/create">create book</Link></li>
                        <li><Link to="/user/profile">userprofile</Link></li>
                        <li><Link to="/book/review">book detail</Link></li>
                        <li><Link to="/admin/profile">admin profile</Link></li>
                    </ul>
                    <div className="search-container" style={{ position: "relative" }}>
                        <input
                            type="text"
                            placeholder="Search....."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                        <SearchDropdown
                            books={books}
                            search={search}
                            isLoading={isLoading}
                            onSelect={() => setSearch("")}
                        />
                    </div>

                    <div className="user-actions">
                        {isAuthenticated && user ? (
                            <div
                                className="avatar-wrapper"
                                onMouseEnter={() => setHovering(true)}
                                onMouseLeave={() => setTimeout(() => setHovering(false), 200)}
                            >
                                <img
                                    src={user.avatarUrl || defaultAvatar}
                                    alt={user.name || user.username}
                                    className="avatar"
                                />
                                <div className={`dropdown ${hovering ? "show" : ""}`}>
                                    <span className="dropdown-item">{user.name || user.username}</span>
                                    <Link to={`/user/${user.username}`} className="dropdown-item" state={{ user }}>
                                        Tài khoản
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item">
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="buttons">
                                <button onClick={() => setShowModal("login")} className="login-btn">
                                    Login
                                </button>
                                <button onClick={() => setShowModal("register")} className="signup-btn">
                                    Sign up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <AuthModal
                showModal={showModal}
                setShowModal={setShowModal}
                handleLogin={handleLogin}
                error={error}
                loading={loading}
            />
        </>
    );
};

export default Navbar;
