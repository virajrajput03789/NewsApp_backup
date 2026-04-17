# NewsApp - React Native News Reader

A high-performance, production-ready React Native CLI application that allows users to browse top headlines, search for specific news, read full article details, and save bookmarks for offline reading.

## 🚀 Features

- **Premium UI/UX**: Implemented professional staggered animations, parallax scrolling effects, and refined typography for a high-end feel.
- **Dynamic News Feed**: Fetches real-time headlines from [NewsAPI.org](https://newsapi.org).
- **Infinite Scrolling**: Optimized `FlatList` with pagination for seamless browsing of large datasets.
- **Debounced Search**: Real-time search functionality with debouncing to minimize unnecessary API calls.
- **Offline Bookmarking**: Save articles to local storage (`AsyncStorage`) via a custom Redux middleware.
- **Smart Refreshing**: Pull-to-refresh and automatic foreground refresh logic (auto-update if data is older than 5 minutes).
- **Responsive Design**: Built entirely with core React Native components (no external UI kits) for maximum control and performance.
- **Error Handling**: Comprehensive state management for loading, error, and empty states.

## 🛠️ Technical Stack

- **Framework**: React Native CLI (0.72.6)
- **Language**: TypeScript
- **State Management**: Redux Toolkit (Slices, Thunks, Selectors)
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Persistence**: AsyncStorage
- **API**: Fetch API with NewsAPI.org

## 🏗️ Architecture & Decisions

### 1. State Management (Redux Toolkit)
- Used **Redux Toolkit** for predictable state updates. 
- **Slices**: Divided state into `articles`, `bookmarks`, and `search` for better modularity.
- **Persistence Middleware**: Implemented a custom middleware to automatically sync the bookmarks slice with `AsyncStorage`, ensuring data consistency without manual calls in every component.

### 2. Performance & UI Awareness
- **FlatList Optimization**: Used `getItemLayout` and `memo` to ensure smooth scrolling.
- **Staggered Animations**: Implemented index-based entry animations for list items using the standard `Animated` API to provide a premium look without third-party libraries.
- **Parallax Detail View**: Created a custom parallax effect on the article header that responds to scroll position.
- **Debouncing**: Search input is debounced (300ms) using a custom hook to avoid rate-limiting from the API.

### 3. App Lifecycle
- Implemented a `useAppState` hook to track when the app returns from the background. If the cached data is stale (5+ minutes), the app automatically triggers a background refresh.

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+)
- React Native Environment (CocoaPods for iOS, JDK for Android)
- **API Key Setup**:
  1. Create a `.env` file from `.env.example` and paste your NewsAPI key there.
  2. For evaluation purposes, you can also paste the key directly into `src/utils/constants.ts` (the `API_KEY` constant).

> ⚠️ **Security First**: In this version, the `API_KEY` in `src/utils/constants.ts` is left empty by default to follow security best practices. The app will throw an error if a key is not provided.

### Installation
```bash
git clone <repository-url>
cd NewsApp
npm install
# Setup your environment variables
cp .env.example .env
```

### Running the App
```bash
# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
```

## 📈 Future Improvements
- **Unit Testing**: Add Jest and React Native Testing Library for critical business logic (Redux reducers and hooks).
- **Shared Element Transitions**: Enhance the transition from the Home list to the Detail view.
- **Dark Mode Support**: Implement theme support using React Native's `Appearance` API.
- **Web Support**: Extend functionality to the web using `react-native-web`.