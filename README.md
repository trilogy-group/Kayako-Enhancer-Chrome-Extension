# Kayako Enhancer Chrome Extension

The Kayako Resizer is a browser extension designed to enhance the agent experience in Kayako by allowing for dynamic and persistent resizing of the text editors. Take control of your workspace by adjusting the main editor's height and the side conversation panel's dimensions to fit your workflow.

## Features

This extension provides several ways to customize your Kayako experience:

1.  **Editor Resizing**:
    * **Popup Controls**:
        - Click the extension icon to open the control panel
        - Set specific dimensions for Main Editor and Side Conversation Editor
    * **Drag-to-Resize**:
        - Main Editor: Hover over the top edge and drag to adjust height
        - Side Panel: Hover over the left edge and drag to adjust width
    * All size settings are saved automatically

2.  **Timeline Customization**:
    * Toggle visibility of different timeline elements:
        - **Events**: Show/hide system events
        - **Internal Notes**: Toggle internal notes
        - **Date Separators**: Show/hide date dividers
    * Note: Hiding many elements may affect infinite scroll. If content doesn't load, try showing elements, scrolling to load more, then re-hiding.

## How to Use

### Using the Popup

1.  Navigate to a conversation page within your Kayako agent dashboard.
2.  Click on the **Kayako Resizer icon** in the Chrome toolbar.
3.  Enter your desired pixel values into the input fields for either the "Main Editor" or "Side Conversation Editor".
4.  Click the corresponding **Apply** button to see the changes immediately.
5.  Use the toggle switches to show/hide timeline elements like system events, internal notes, and date separators.

### Using Drag-to-Resize

1.  **To resize the main editor's height:**
    * Move your cursor to the very top border of the main reply editor.
    * The cursor will change to a vertical two-headed arrow.
    * Click and drag up or down to your desired height and release.

2.  **To resize the side conversation panel's width:**
    * First, ensure a side conversation is open.
    * Move your cursor to the left-hand border of the side panel.
    * The cursor will change to a horizontal two-headed arrow.
    * Click and drag left or right to your desired width and release.

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
        
