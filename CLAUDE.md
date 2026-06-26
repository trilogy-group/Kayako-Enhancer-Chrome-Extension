# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Chrome extension (Manifest V3) that enhances the Kayako helpdesk agent interface. Features: drag-to-resize text editors, toggle visibility of timeline elements, and cross-brand session cookie propagation.

## Build

The only build step bundles `brands.js` into the background service worker:

```
node build.js
```

This replaces the `BRANDS_IMPORT` placeholder in `background.js` and outputs `background.bundled.js`. **Never edit `background.bundled.js` directly** — edit `background.js` and regenerate.

Run `node build.js` whenever `brands.js` or `background.js` changes.

## Loading the Extension

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**, select this directory
4. After code changes, click the reload button on the extension card (or `Ctrl+R` on the extensions page)

## Architecture

**Entry points:**
- `manifest.json` — defines permissions, content script host matches, popup, and service worker
- `content.js` — injected into `*://*.kayako.com/agent/*`; handles editor resizing and timeline toggles
- `popup.html/js/css` — extension popup UI that sends messages to the active tab
- `background.js` / `background.bundled.js` — service worker for cookie sync across brands

**Communication pattern:** `popup.js` sends `chrome.tabs.sendMessage()` to `content.js` with action types (`resize`, `resizeSideConversation`, `toggleEvents`, `toggleNotes`, `toggleDateSeparators`). State is persisted via `chrome.storage.local`.

**Cookie sync:** `background.bundled.js` listens for cookie changes on `central-supportdesk.kayako.com` and propagates the `novo_sessionid` cookie to all ~269 brand URLs defined in `brands.js`.

**Drag-to-resize:** `content.js` attaches `mousedown`/`mousemove`/`mouseup` listeners using `requestAnimationFrame` for smooth updates. A `draggableAttached` flag on DOM elements prevents duplicate listener attachment. `MutationObserver` is used to re-attach handles when Kayako's React app re-renders the DOM.

## Adding a New Brand

Add the URL to the `BRANDS` array in `brands.js`, then run `node build.js`.
