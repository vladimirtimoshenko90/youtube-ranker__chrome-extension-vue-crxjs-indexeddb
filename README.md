# YouTube Ranker - Chrome Extension

A powerful Chrome extension that brings personalized video and channel ratings to YouTube. Rate videos, channels, and creators as you browse, and instantly see your ratings across the platform with intelligent organization and filtering.

## Features

- **Rate & Track**: 5-star rating system for videos, channels, and creators
- **Seamless Integration**: Ratings displayed on YouTube home, search, and watch pages
- **Local Storage**: All ratings stored privately using IndexedDB—no cloud sync needed
- **Multi-Page Support**: Dedicated content scripts for different YouTube page types
- **Organized Dashboard**: Overview page to manage all your ratings at a glance

## Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev
```

Then in Chrome:

- Go to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked" and select the `dist` folder

For production:

```bash
npm run build
```

## Tech Stack

- **Vue 3** with TypeScript and `<script setup>` syntax
- **Vite** for instant HMR and optimized builds
- **CRXJS** for seamless Chrome extension development
- **IndexedDB** for local data persistence
- **SCSS** for advanced styling
