# YouTube Ranker — Chrome Extension

A Chrome extension for rating YouTube videos as you browse. Ratings are stored locally and displayed inline across YouTube, with a per-creator overview available at any time.

## Features

- **Video Ratings**: 5-star rating per video with an optional comment, or mark as "not relevant" to skip
- **Author Average**: Computed average rating shown inline next to each video, with a link to the author overview
- **YouTube Integration**: Rating UI injected into YouTube home, search, watch, and channel pages
- **Author Overview**: Dedicated page listing all rated videos for a specific creator
- **Ratings Dashboard**: Overview page showing all ratings across every author
- **Local Storage**: All data stored privately in IndexedDB — nothing leaves your browser

## Development

```bash
npm ci
npm run dev
```

Then load the extension in Chrome:

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist` folder, or drag and drop the `dist` folder onto the page

## Production

```bash
npm run build
```

Load the extension using the same steps as in Development (first install only).

## Installation Notes

> **Do not reinstall the extension to apply updates** — reinstalling creates a new extension ID and wipes all IndexedDB data.

Instead, run `npm run dev` or `npm run build`, then click the **refresh icon** on the extension card in `chrome://extensions/`.

## Tech Stack

- **Vue 3** with TypeScript and `<script setup>` syntax
- **Vite** for bundling and development server
- **CRXJS** for Chrome extension integration
- **IndexedDB** for local data persistence
- **SCSS** for advanced styling
