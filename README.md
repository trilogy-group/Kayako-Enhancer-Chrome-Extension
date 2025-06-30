# Kayako Enhancer Chrome Extension

The Kayako Resizer is a browser extension designed to enhance the agent experience in Kayako by allowing for dynamic and persistent resizing of the text editors, as well as keeping you logged in across multiple Kayako brands. Take control of your workspace to fit your workflow.

## Features

This extension provides several ways to customize your Kayako experience:

1.  **Editor Resizing**:
    * **Popup Controls**:
        - Click the extension icon to open the control panel
        - Set specific dimensions for Main Editor and Side Conversation Editor
        - These settings are saved and will be used every time you load a page.
    * **Drag-to-Resize**:
        - You can resize the main editor or side conversation panel by dragging their edges.
        - Dragging immediately overrides all other size settings (including popup and Kayako's own defaults) for the current session.
        - For the side panel, this override ends when you leave the conversation or switch away from it (not just on refresh).
        - To change the persistent min/max limits, use the popup controls.

2.  **Timeline Customization**:
    * Toggle visibility of different timeline elements:
        - **Events**: Show/hide system events
        - **Internal Notes**: Toggle internal notes
        - **Date Separators**: Show/hide date dividers
    * Note: Hiding many elements may affect infinite scroll. If content doesn't load, try showing elements, scrolling to load more, then re-hiding.

3.  **Persistent Login**:
    * When you log in to the Central Kayako brand (e.g., central-supportdesk.kayako.com), the extension keeps you logged in across all your configured Kayako brands automatically. You only need to log in once, and your session is synchronized everywhere.

## How to Use

### Using the Popup

1.  Navigate to a conversation page within your Kayako agent dashboard.
2.  Click on the **Kayako Resizer icon** in the Chrome toolbar.
3.  Enter your desired pixel values into the input fields for either the "Main Editor" or "Side Conversation Editor".
4.  Click the corresponding **Apply** button to see the changes immediately. These values are saved and will be used every time you visit a page.
5.  Use the toggle switches to show/hide timeline elements like system events, internal notes, and date separators.

### Using Drag-to-Resize

- To resize, simply drag the edge of the main editor or side conversation panel. This override lasts until you leave the conversation, switch away from the side panel, or reload the page.
- Dragging always takes priority over popup or default settings for the current session.

## Installation

To install the extension locally for development or personal use:

1.  Download or clone this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable **Developer mode** by toggling the switch in the top-right corner.
4.  Click the **Load unpacked** button.
5.  Select the directory where you saved the extension files.
6.  The Kayako Resizer extension will now be installed and active.

## Compatibility

This extension is specifically designed to work with the agent view of the Kayako platform (URLs matching `*://*.kayako.com/agent/*`). It may not function correctly on other parts of Kayako or on other websites.