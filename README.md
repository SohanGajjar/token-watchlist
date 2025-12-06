# 📊 Crypto Watchlist — React + Vite Assignment

A responsive, high-performance crypto watchlist application built as an assignment for an interview evaluation.  
This project demonstrates clean architecture, API integration, state management (Redux Toolkit), reusable UI components, and mobile-first UX with a bottom-sheet modal interaction.

---

## 🚀 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React 18, Vite, TypeScript |
| State Management | Redux Toolkit, React-Redux |
| UI / Styling | Tailwind CSS |
| API | CoinGecko Search API |
| Build Tools | Vite, ESBuild |

---

## 🎯 Core Features

### ✅ 1. Token Search & Add to Watchlist
- Search tokens using CoinGecko API  
- Select multiple tokens  
- Prevent adding duplicates  
- Smooth UX with loading & selection states

### ✅ 2. Watchlist Management
- Added tokens stored in Redux state  
- Displays token name, symbol, and image  
- Clears only when user removes them manually

### ✅ 3. Mobile-Optimized Bottom Sheet Modal
- Swipe-to-close gesture  
- Smooth slide-up animation  
- Drag indicator  
- Scroll-locking when modal is open  
- Escape-key + backdrop close on desktop  

### ✅ 4. Clean & Scalable Architecture
- Modular feature-based structure  
- Reusable hooks & components  
- Strong TypeScript models  
- Separation of UI, state, and API logic
