# NewsApp

A production-ready React Native CLI application that fetches news articles, allows searching, reading details, and bookmarking favorite articles offline.

## Functionality
- **Home Screen**: Paginated list of top headlines fetched from jsonplaceholder. Includes pull-to-refresh, infinite scroll, and a debounced search bar.
- **Detail Screen**: Full article view with title, image, description, and source link. Users can bookmark the article from the header.
- **Bookmarks Screen**: Locally saved articles accessible via a bottom tab navigator. Available offline.
- **App Lifecycle**: Refreshes articles silently when returning from the background (if older than 5 minutes).
- **Offline Capabilities**: Caches the first page of articles and persists bookmarks across sessions.

## Setup & Run Instructions
1. `cd NewsApp`
2. `npm install`
3. `npm run ios` or `npm run android`