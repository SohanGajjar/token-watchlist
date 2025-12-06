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

---

## 📂 Project Structure

├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│ ├── placeholder.svg
│ └── robots.txt
└── src/
├── main.tsx
├── App.tsx
├── index.css
├── config/
│ └── wagmi.ts
├── components/
│ ├── layout/
│ │ ├── Header.tsx
│ │ └── PageContainer.tsx
│ ├── portfolio/
│ │ ├── MobileTokenCard.tsx
│ │ ├── PortfolioDonutChart.tsx
│ │ ├── PortfolioSummaryCard.tsx
│ │ ├── SparklineChart.tsx
│ │ ├── WatchlistPagination.tsx
│ │ ├── WatchlistTable.tsx
│ │ └── WatchlistTableRow.tsx
│ ├── tokens/
│ │ ├── AddTokenModal.tsx
│ │ ├── TokenSearchList.tsx
│ │ └── TokenSearchListSkeleton.tsx
│ ├── ui/
│ │ ├── accordion.tsx
│ │ ├── alert-dialog.tsx
│ │ ├── alert.tsx
│ │ ├── aspect-ratio.tsx
│ │ ├── avatar.tsx
│ │ ├── badge.tsx
│ │ ├── breadcrumb.tsx
│ │ ├── button.tsx
│ │ ├── calendar.tsx
│ │ ├── card.tsx
│ │ ├── carousel.tsx
│ │ ├── chart.tsx
│ │ ├── checkbox.tsx
│ │ ├── collapsible.tsx
│ │ ├── command.tsx
│ │ ├── context-menu.tsx
│ │ ├── dialog.tsx
│ │ ├── drawer.tsx
│ │ ├── dropdown-menu.tsx
│ │ ├── form.tsx
│ │ ├── hover-card.tsx
│ │ ├── input-otp.tsx
│ │ ├── input.tsx
│ │ ├── label.tsx
│ │ ├── menubar.tsx
│ │ ├── navigation-menu.tsx
│ │ ├── pagination.tsx
│ │ ├── popover.tsx
│ │ ├── progress.tsx
│ │ ├── radio-group.tsx
│ │ ├── resizable.tsx
│ │ ├── scroll-area.tsx
│ │ ├── select.tsx
│ │ ├── separator.tsx
│ │ ├── sheet.tsx
│ │ ├── sidebar.tsx
│ │ ├── skeleton.tsx
│ │ ├── slider.tsx
│ │ ├── sonner.tsx
│ │ ├── switch.tsx
│ │ ├── table.tsx
│ │ ├── tabs.tsx
│ │ ├── textarea.tsx
│ │ ├── toast.tsx
│ │ ├── toaster.tsx
│ │ ├── toggle-group.tsx
│ │ ├── toggle.tsx
│ │ ├── tooltip.tsx
│ │ └── use-toast.ts
│ ├── wallet/
│ │ └── WalletConnectButton.tsx
│ └── NavLink.tsx
├── features/
│ ├── portfolio/
│ │ └── portfolioSlice.ts
│ ├── tokens/
│ │ └── useInfiniteTokenSearch.ts
│ └── ui/
│ └── uiSlice.ts
├── hooks/
│ ├── use-mobile.tsx
│ └── use-toast.ts
├── lib/
│ ├── coingecko.ts
│ └── utils.ts
├── pages/
│ ├── Index.tsx
│ └── NotFound.tsx
├── store/
│ ├── hooks.ts
│ └── index.ts
└── types/
└── portfolio.ts