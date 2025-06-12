# Kayako Resizer Chrome Extension

The Kayako Resizer is a browser extension designed to enhance the agent experience in Kayako by allowing for dynamic and persistent resizing of the text editors.
It is not an official subproduct from Kayako, but a way Central Support used to take control of our workspace by adjusting the main editor's height and the side conversation panel's dimensions to fit our workflow.

## Features

This extension provides two convenient ways to resize the Kayako editors:

1.  **Popup Controls**:
    * Click the extension icon in your browser toolbar to open a control panel.
    * **Main Editor**: Set specific `min-height` and `max-height` values in pixels.
    * **Side Conversation Editor**: Independently control the `min-width`, `min-height`, and `max-height`.
    * Your settings are saved automatically and will persist across browser sessions.

2.  **Drag-to-Resize (Interactive Mode)**:
    * **Main Editor (Height)**: Simply hover your mouse over the top edge of the main text editor. When the cursor changes to a resize icon (`row-resize`), click and drag vertically to adjust its height.
    * **Side Conversation Panel (Width)**: Hover over the left edge of the open side conversation panel. When the cursor changes to a resize icon (`col-resize`), click and drag horizontally to adjust its width.
    * The dimensions are automatically saved upon releasing the mouse, updating the values in the popup.

## How to Use

### Using the Popup

1.  Navigate to a conversation page within your Kayako agent dashboard.
2.  Click on the **Kayako Resizer icon** in the Chrome toolbar.
3.  Enter your desired pixel values into the input fields for either the "Main Editor" or "Side Conversation Editor".
4.  Click the corresponding **Apply** button to see the changes immediately.

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

This extension is specifically created for the CS agent view of the Kayako platform (URLs matching `*://*.kayako.com/agent/*`). It may not function correctly on other parts of Kayako or on other Kayako instances.
