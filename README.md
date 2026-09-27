# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
#  Manga Reading Web

A modern web application for reading and managing manga/books online, built with **React, TypeScript, and Vite**.

The project provides a responsive reading platform where users can browse books, search for manga, read chapters, manage favourites and bookmarks, interact through comments, and track their reading activity.

This project was developed as a frontend application designed to communicate with a **microservices-based backend architecture** through REST APIs.

---

##  Features

### Book Browsing
- Browse available manga/books
- View detailed book information
- Display book covers, descriptions, genres, and chapters
- Browse books by genre/category
- View recommended and featured books

###  Search
- Search books by title
- Debounced search input for better performance
- Display search suggestions/results dynamically
- Navigate directly to book details from search results

###  Chapter Reading
- View chapter lists
- Read manga/book chapters
- Navigate between chapters
- User-friendly reading interface

###  Favourite Books
- Add books to favourites
- Remove books from favourites
- View personal favourite list

###  Bookmark
- Bookmark books or reading content
- Manage saved bookmarks
- Quickly return to saved content

###  Comments
- View comments for books/chapters
- Add comments
- Support interaction between readers

###  Reading History
- Track previously read books and chapters
- Help users quickly continue reading

###  User Profile
- View user information
- Manage personal settings
- Access favourites, bookmarks, and reading activity

###  Book Management
The application also includes book management flows such as:

- Create a book
- Add chapters
- Review book information
- Manage book content

---

##  Tech Stack

### Frontend

- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **Redux Toolkit**
- **React Redux**
- **TanStack React Query**
- **Axios**

### UI & Styling

- **Bootstrap**
- **SCSS / Sass**
- **Tailwind CSS**
- **Font Awesome**
- **React Icons**
- **Framer Motion**
- **Anime.js**
- **React Toastify**

### API Integration

- RESTful APIs
- OpenAPI Generator
- TypeScript Axios Client

The application is designed to communicate with multiple backend microservices.

---

##  Microservices Integration

The frontend contains API clients for services including:

```text
Authentication Service
Book Service
Chapter Service
Comment Service
Bookmark Service
Favourite Service
Search Service
Reading History Service
User Profile Service
Upload Service
Crawl Service
```

API clients are generated automatically from backend OpenAPI specifications using:

```bash
@openapitools/openapi-generator-cli
```

This helps maintain consistent API models and request methods between the frontend and backend.

---

## Project Structure

```text
manga-reading-web/
│
├── public/
│
├── src/
│   ├── api/
│   │   ├── auth-service/
│   │   ├── book-service/
│   │   ├── bookmark-service/
│   │   ├── chapter-service/
│   │   ├── comment-service/
│   │   ├── favourite-service/
│   │   ├── readingHistory-service/
│   │   ├── search-service/
│   │   ├── upload-service/
│   │   └── userProfile-service/
│   │
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── assets/
│   └── ...
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Usio93/manga-reading-web.git
```

### 2. Navigate to the project directory

```bash
cd manga-reading-web
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local URL displayed by Vite, typically:

```text
http://localhost:5173
```

---

## 📦 Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🔌 API Client Generation

The project uses **OpenAPI Generator** to generate TypeScript API clients from backend services.

For example:

```bash
npm run gen:book
```

Generate the Chapter Service:

```bash
npm run gen:chapter
```

Generate the Comment Service:

```bash
npm run gen:comment
```

Generate the Bookmark Service:

```bash
npm run gen:bookmark
```

Generate the Favourite Service:

```bash
npm run gen:favourite
```

Generate the Search Service:

```bash
npm run gen:search
```

These commands generate TypeScript Axios clients based on the OpenAPI documentation provided by the backend services.

---

## 🔄 Application Flow

A typical user flow:

```text
Home
  ↓
Search / Browse Manga
  ↓
Book Details
  ↓
Chapter List
  ↓
Read Chapter
  ↓
Comment / Bookmark / Favourite
  ↓
Reading History
```

Book management flow:

```text
Create Book
  ↓
Add Book Information
  ↓
Add Chapters
  ↓
Review Content
  ↓
Publish / Display
```

---

## 🎯 Project Purpose

The purpose of this project is to practice and demonstrate:

- Modern frontend development with React and TypeScript
- Component-based UI development
- RESTful API integration
- Microservices communication
- API client generation using OpenAPI
- State management
- Data fetching and caching
- Routing
- Search functionality
- Responsive UI development
- Real-world frontend project organization

---

## 💡 What I Learned

Through this project, I gained practical experience with:

- Building reusable React components
- Developing applications with TypeScript
- Integrating frontend applications with REST APIs
- Working with microservice-based systems
- Managing server state with React Query
- Managing application state using Redux Toolkit
- Implementing routing with React Router
- Handling asynchronous API requests with Axios
- Implementing search with debounce
- Building favourites and bookmark features
- Designing book and chapter management flows
- Using Git and GitHub for source control

---

## 🔮 Future Improvements

Possible improvements include:

- Improve responsive design for mobile devices
- Add authentication UI improvements
- Add advanced manga recommendations
- Add reader customization options
- Improve loading and error states
- Add dark/light themes
- Improve performance with lazy loading
- Add automated testing
- Add CI/CD pipeline
- Deploy the application publicly

---



If you find this project useful or interesting, feel free to give it a ⭐ on GitHub.

---

> This project was developed for learning, portfolio building, and demonstrating practical frontend development skills with React, TypeScript, REST APIs, and microservices.
