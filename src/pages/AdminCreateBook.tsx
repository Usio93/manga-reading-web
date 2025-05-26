import { useNavigate } from 'react-router-dom';
import "../styles/AdminCreateBook/AdminCreateBook.scss";
import React, { useState } from 'react';
import Navbar from "../components/Navbar";

import { useCreateBook } from "../hooks/bookService/useBook";

export interface BookForm {
    title: string;
    author: string;
    description: string;
    categories: string[];
    coverUlr: File | null;
}

const suggestedCategories = [
    'Action', 'Adventure', 'Anime', 'Comedy', 'Comic', 'Cooking', 'Historical', 'Doujinshi', 'Drama', 'Fantasy',
    'Isekai', 'Josei', 'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery', 'One Shot', 'Psychological',
    'Romance', 'Samurai', 'School Life', 'Sci-Fi', 'Seinen', 'Shoujo', 'Shoujo Ai', 'Shounen', 'Shounen Ai',
    'Slice of Life', 'Smut', 'Sports', 'Supernatural', 'Tragedy', 'Vampire', 'Webtoon', 'Reincarnation', 'Manhua',
    'Manhwa', 'Girls Love', 'Detective', 'Game', 'Humor', 'Thriller', 'Horror', 'Urban', 'Magic Realism',
    'Superpower', 'Fantasy Romance', 'Time Travel', 'Post-Apocalyptic'
];

const CreateBookForm: React.FC = () => {
    const [form, setForm] = useState<BookForm>({
        title: '',
        author: '',
        description: '',
        categories: [],
        coverUlr: null,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [newCategory, setNewCategory] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const { mutate: createBook } = useCreateBook();

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.title) newErrors.title = 'Not null!';
        if (!form.author) newErrors.author = 'Not null!';
        if (!form.coverUlr) newErrors.image = 'Not null!';
        if (form.categories.length === 0) newErrors.categories = 'At least 1';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result as string;
            const newBook = {
                title: form.title,
                author: form.author,
                description: form.description,
                categories: form.categories,
                imageBase64: base64Image,
            };

            createBook(newBook, {
                onSuccess: () => {
                    navigate('/admin/review', { state: { book: newBook } });
                }
            });
        };

        if (form.coverUlr) {
            reader.readAsDataURL(form.coverUlr);
        }
    };

    const handleCategoryAdd = () => {
        const trimmed = newCategory.trim();
        if (trimmed && !form.categories.includes(trimmed)) {
            setForm({ ...form, categories: [...form.categories, trimmed] });
        }
        setNewCategory('');
        setShowSuggestions(false);
    };

    const handleCategoryRemove = (cat: string) => {
        setForm({ ...form, categories: form.categories.filter((c) => c !== cat) });
    };

    return (
        <div className="container-create-book">
            <Navbar />
            <h1 className="create-book-title">Create Book</h1>
            <div className="create-book-form">


                <div className="image-upload">
                    <label className="avatar-book">
                        <strong>Avatar book</strong>
                        <div className="custom-upload-admin">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setForm({ ...form, coverUlr: e.target.files?.[0] || null })}
                            />
                            {!form.coverUlr && '+'}
                        </div>
                        {form.coverUlr && (
                            <div className="image-preview-wrapper">
                                <img
                                    src={URL.createObjectURL(form.coverUlr)}
                                    alt="Preview"
                                    className="preview-image"
                                />
                                <button
                                    type="button"
                                    className="remove-image"
                                    onClick={() => setForm({ ...form, coverUlr: null })}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </label>
                    {errors.image && <span className="error">! {errors.image}</span>}
                </div>

                {/* Title */}
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                    {errors.title && <span className="error">! {errors.title}</span>}
                </div>

                {/* Author */}
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Author"
                        value={form.author}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                    />
                    {errors.author && <span className="error">! {errors.author}</span>}
                </div>

                {/* Description */}
                <div className="form-group">
                    <textarea
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    ></textarea>
                </div>

                {/* Categories */}
                <div className="form-group category-field">
                    <label>Categories:</label>
                    <div className="category-list">
                        {form.categories.map((cat, index) => (
                            <span key={index} className="tag">
                                {cat}
                                <button type="button" onClick={() => handleCategoryRemove(cat)}>&times;</button>
                            </span>
                        ))}
                    </div>
                    <div className="category-input-wrapper">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Add category"
                        />
                        <button type="button" onClick={handleCategoryAdd}>+</button>
                        <span className="dropdown-icon" onClick={() => setShowSuggestions(!showSuggestions)}>▼</span>
                    </div>
                    {showSuggestions && (
                        <div className="category-suggestions">
                            {suggestedCategories.map((cat, index) => (
                                <div
                                    key={index}
                                    className="suggestion"
                                    onClick={() => {
                                        if (!form.categories.includes(cat)) {
                                            setForm({ ...form, categories: [...form.categories, cat] });
                                        }
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.categories && <span className="error">! {errors.categories}</span>}
                </div>

                <button className="submit-btn" onClick={handleSubmit}>Create book</button>
            </div>
        </div>
    );
};

export default CreateBookForm;

