# 🌿 Ashok Vatika 2.0

An interactive full-stack MERN application that enables users to explore medicinal plants, learn through structured virtual tours, and analyze product ingredients using OCR.

---

## 🚀 Overview

Ashok Vatika 2.0 is designed as a **modern educational platform** combining:

* 🌿 **Plant Exploration** (API-driven)
* 🎮 **Gamified Learning** (Virtual Tours + Quizzes)
* 🤖 **Smart Ingredient Analyzer** (OCR + Database Matching)

The project focuses on **clean architecture, performance optimization, and real-world usability**.

---

## ✨ Features

### 🌿 Virtual Garden

* Browse and explore medicinal plants
* Fetch real-time plant data from external API
* Clean, structured display of plant details
* Null-safe rendering (only relevant data shown)

---

### 🔍 Smart Search & Filtering

* Search plants using API-based query
* Search tours from database
* Debounced search for optimized API calls
* Filter and pagination support

---

### 🎮 Gamified Virtual Tours

* Category-based tours (Immunity, Skincare, etc.)
* Section-wise learning structure
* Quiz-based progression system
* Unlock next section upon passing quiz

---

### 🤖 Ingredient Analyzer

* Upload product ingredient image
* OCR-based text extraction using Tesseract
* Ingredient classification:

  * 🔴 Harmful
  * 🟢 Safe
  * ⚪ Unknown
* Fast lookup using indexed database queries

---

### 👤 Authentication

* Secure authentication using Clerk
* Protected routes and session handling

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### External Services

* Perenual API (Plant Data)
* Tesseract OCR (Text Extraction)
* Clerk (Authentication)

---

## ⚙️ System Architecture

Frontend → Backend → Database
                ↓
        External APIs (Plant API + OCR)

---

## ⚡ Performance & Optimization

This project is built with **scalability and performance in mind**.

---

### 🚀 Redis Caching

* Cached plant API responses
* Reduces redundant API calls
* Improves response time significantly

---

### 🔍 Database Indexing

* Indexed `ingredient_name` field
* Enables fast lookup during ingredient analysis

```js
ingredientSchema.index({ ingredient_name: 1 });
```

---

### 📄 Pagination

* Efficient data loading using:

```text
?page=1&limit=10
```

* Prevents large payload responses

---

### 🔎 Debounced Search

* Reduces unnecessary API calls
* Improves frontend performance

---

### 🚦 Rate Limiting

* Prevents abuse of:

  * Auth routes
  * Analyzer API
* Protects backend resources

---

### 🧠 Efficient Querying

* Batch queries using `$in` operator
* Avoids multiple database calls

---

### 🧼 Clean Code Practices

* MVC architecture
* Modular services
* Reusable components
* Centralized error handling

---

## 📊 Database Design

### Tours (Embedded Structure)

* Tour → Sections → Quiz
* Reduces joins and improves performance

---

### Ingredients

```js
{
  ingredient_name,
  rating,
  functions
}
```

---

### User Progress

```js
{
  userId,
  tourId,
  completedSections: [],
  scores: {}
}
```

---

## 🐳 Deployment & DevOps

* Docker containerization for backend & frontend
* Cloud deployment:

  * Frontend: Vercel
  * Backend: Render / AWS
  * Database: MongoDB Atlas

---

## 🔒 Security

* Input validation
* Rate limiting
* Secure authentication via Clerk
* Environment variable protection

---

## 🚀 Future Enhancements

* AI-based ingredient classification
* Recommendation engine
* Admin dashboard for tour management
* Community features (reviews, discussions)

---

## 💡 Key Highlights

* Hybrid architecture (API + Database)
* Real-world OCR integration
* Optimized backend with indexing & caching
* Gamified learning system
* Scalable and production-ready design

---

## 🧑‍💻 Getting Started

```bash
# Clone repo
git clone https://github.com/your-username/ashok-vatika

# Install dependencies
npm install

# Run backend
npm run dev

# Run frontend
npm start
```

---

## 📌 Summary

Ashok Vatika 2.0 is not just a MERN project —
it is a **scalable, performance-optimized educational platform** combining:

* API integration
* Database optimization
* OCR-based intelligence
* Gamified learning

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
