// Function to resize the main editor with both min-height and max-height
function resizeEditor(minHeight, maxHeight) {
    let editor = document.querySelector(".fr-wrapper");
    if (editor) {
        editor.style.minHeight = minHeight + "px";
        editor.style.maxHeight = maxHeight + "px";
    }
}

// Function to resize the side conversation editor
function resizeSideConversationEditor(minWidth, minHeight, maxHeight) {
    let sidePanel = document.querySelector(".side-conversations-panel__side-panel_4k6b2r");
    if (sidePanel) {
        if (sidePanel.classList.contains("side-conversations-panel__open_4k6b2r")) {
            sidePanel.style.minWidth = minWidth + "px";
        } else {
            sidePanel.style.minWidth = "";
        }
    }

    let sideEditorWrapper = sidePanel ? sidePanel.querySelector(".fr-wrapper") : null;
    if (sideEditorWrapper) {
        sideEditorWrapper.style.maxHeight = maxHeight + "px";
        let editorElement = sideEditorWrapper.querySelector(".fr-element.fr-view");
        if (editorElement) {
            editorElement.style.minHeight = minHeight + "px";
        }
    }
}

// Default values
const defaultMinHeight = 200;
const defaultMaxHeight = 600;
const defaultSideMinWidth = 500;
const defaultSideMinHeight = 100;
const defaultSideMaxHeight = 300;

// Function to apply saved or default sizes
function applyAllEditorSizes() {
    chrome.storage.local.get(["editorMinHeight", "editorMaxHeight"], (data) => {
        resizeEditor(data.editorMinHeight || defaultMinHeight, data.editorMaxHeight || defaultMaxHeight);
    });
    chrome.storage.local.get(["sideMinWidth", "sideMinHeight", "sideMaxHeight"], (data) => {
        resizeSideConversationEditor(data.sideMinWidth || defaultSideMinWidth, data.sideMinHeight || defaultSideMinHeight, data.sideMaxHeight || defaultSideMaxHeight);
    });
}


// --- DRAG-TO-RESIZE FUNCTIONALITY STARTS HERE ---

/**
 * Initializes drag-to-resize for the main text editor (vertical resizing).
 * @param {HTMLElement} container - The container element for the text editor.
 */
function initMainEditorDraggable(container) {
    if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
    }

    container.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        // Make the top 10px the draggable handle
        if (e.clientY - rect.top <= 10) {
            container.style.cursor = 'row-resize';
        } else {
            container.style.cursor = 'auto';
        }
    });

    container.addEventListener('mousedown', function(e) {
        const rect = container.getBoundingClientRect();
        if (e.clientY - rect.top <= 10) { // Check if the mousedown is on the handle
            e.preventDefault();

            // Fetch min and max from storage
            chrome.storage.local.get(["editorMinHeight", "editorMaxHeight"], (data) => {
                const minHeight = data.editorMinHeight || defaultMinHeight;
                const maxHeight = data.editorMaxHeight || defaultMaxHeight;

                const startY = e.clientY;
                const resizable = container.querySelector('.fr-element.fr-view');
                if (!resizable) return;

                const startH = resizable.offsetHeight;
                let lastDY = 0;
                let rafScheduled = false;

                function updateHeight() {
                    let newHeight = startH - lastDY;
                    // Clamp newHeight between minHeight and maxHeight
                    newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
                    resizable.style.height = newHeight + 'px';
                    // Set maxHeight directly, no buffer
                    const wrapper = container.querySelector('.fr-wrapper');
                    if(wrapper) wrapper.style.maxHeight = maxHeight + 'px';
                    rafScheduled = false;
                }

                function move(e) {
                    lastDY = e.clientY - startY;
                    if (!rafScheduled) {
                        rafScheduled = true;
                        requestAnimationFrame(updateHeight);
                    }
                }

                function up() {
                    document.removeEventListener('mousemove', move);
                    document.removeEventListener('mouseup', up);
                    container.style.cursor = 'auto';

                    // Save the new height to storage as maxHeight
                    // const finalHeight = resizable.offsetHeight;
                    // chrome.storage.local.set({ editorMaxHeight: finalHeight });
                }

                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', up);
            });
        }
    });
}

/**
 * Initializes drag-to-resize for the side conversation panel (horizontal resizing).
 * @param {HTMLElement} panel - The side conversation panel element.
 */
function initSideConversationDraggable(panel) {
     panel.addEventListener('mousemove', function(e) {
        const rect = panel.getBoundingClientRect();
        // Make the left 10px the draggable handle
        if (e.clientX - rect.left <= 10) {
            panel.style.cursor = 'col-resize';
        } else {
            panel.style.cursor = 'auto';
        }
    });

    panel.addEventListener('mousedown', function(e) {
        const rect = panel.getBoundingClientRect();
         if (e.clientX - rect.left <= 10) { // Check if mousedown is on the handle
            e.preventDefault();

            const startX = e.clientX;
            const startW = panel.offsetWidth;
            let lastDX = 0;
            let rafScheduled = false;

            function updateWidth() {
                panel.style.minWidth = (startW - lastDX) + 'px';
                rafScheduled = false;
            }

            function move(e) {
                lastDX = e.clientX - startX;
                if (!rafScheduled) {
                    rafScheduled = true;
                    requestAnimationFrame(updateWidth);
                }
            }

            function up() {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
                panel.style.cursor = 'auto';

                // Save the new width to storage
                // const finalWidth = panel.offsetWidth;
                // chrome.storage.local.set({ sideMinWidth: finalWidth });
            }

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        }
    });
}


/**
 * Attaches listeners to all found editor components.
 * This is called by the MutationObserver.
 */
function attachAllListeners() {
    // Attach to main editor
    const mainContainers = document.querySelectorAll('[class*="ko-text-editor__container"]');
    mainContainers.forEach(c => {
        if (!c.dataset.draggableAttached) {
            initMainEditorDraggable(c);
            c.dataset.draggableAttached = "true";
        }
    });

    // Attach to side conversation panel
    const sidePanel = document.querySelector(".side-conversations-panel__side-panel_4k6b2r.side-conversations-panel__open_4k6b2r");
    if (sidePanel && !sidePanel.dataset.draggableAttached) {
         initSideConversationDraggable(sidePanel);
         sidePanel.dataset.draggableAttached = "true";
    }
}

// --- DRAG-TO-RESIZE FUNCTIONALITY ENDS HERE ---

// --- VISIBILITY FUNCTIONALITY STARTS HERE ---

// Function to toggle event visibility
function toggleEvents(hide) {
    const styleId = 'kayako-events-style';
    let style = document.getElementById(styleId);
    
    if (hide) {
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* Target only standard timeline posts that are direct children of the timeline list */
                .ko-timeline-2_list_post__post_1nm4l4 > .ko-timeline-2_list_post__standard_1nm4l4 {
                    display: none !important;
                }
                
                /* Ensure the parent post element is also hidden */
                .ko-timeline-2_list_post__post_1nm4l4:has(> .ko-timeline-2_list_post__standard_1nm4l4) {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        if (style) {
            style.remove();
        }
    }
}

// Function to toggle internal notes visibility
function toggleInternalNotes(hide) {
    const styleId = 'kayako-internal-notes-style';
    let style = document.getElementById(styleId);
    
    if (hide) {
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* Target all internal notes */
                .ko-timeline-2_list_item__note_1oksrd {
                    display: none !important;
                }
                
                /* Ensure the parent post element is also hidden */
                .ko-timeline-2_list_post__post_1nm4l4:has(> .ko-timeline-2_list_item__note_1oksrd) {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        if (style) {
            style.remove();
        }
    }
}

// Function to toggle day separators visibility
function toggleDaySeparators(hide) {
    const styleId = 'kayako-day-separators-style';
    let style = document.getElementById(styleId);
    
    if (hide) {
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* Target all day separators - multiple selectors for better coverage */
                .ko-timeline-2_list_days__day-separator_1bbqo9,
                [class*='day-separator'] {
                    display: none !important;
                    opacity: 0 !important;
                    height: 0 !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    border: none !important;
                    visibility: hidden !important;
                }
                
                /* Also target the parent container that might be controlling visibility */
                [class*='ko-timeline-2_list_days'] {
                    min-height: 0 !important;
                }
            `;
            document.head.appendChild(style);
            
            // Force a reflow to ensure styles are applied
            document.body.offsetHeight;
        }
    } else {
        if (style) {
            style.remove();
        }
    }
    
    // Debug: Log the current state and found elements
    console.log('Day separators hidden:', hide);
    console.log('Found day separators:', document.querySelectorAll('.ko-timeline-2_list_days__day-separator_1bbqo9, [class*="day-separator"]').length);
}

// --- VISIBILITY FUNCTIONALITY ENDS HERE ---

// --- HEADER WRAP FUNCTIONALITY STARTS HERE ---

// When the Side Conversations panel is open the case header bar loses width and
// its controls (id, Change Brand, SLA, complete, trash, menu) overlap the tabs.
// Inject a style that, *only* while the panel is open, wraps the entire control
// cluster (.ko-tabs__right) onto a second line below the tabs. Gated on the
// panel's open class via :has(), so it reverts automatically when the panel closes.
function injectHeaderWrapStyle() {
    const styleId = 'kayako-header-wrap-style';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* Let the heading grow to fit a second row of controls.
           flex: none breaks any fixed flex-basis the parent layout imposes,
           so the bar's background expands instead of overlapping content below. */
        body:has(.side-conversations-panel__open_4k6b2r) .ko-agent-content_layout__heading_15wz2w {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            flex: none !important;
            overflow: visible !important;
        }

        /* Stack the tab list and the control cluster vertically */
        body:has(.side-conversations-panel__open_4k6b2r) .ko-tabs__tabs_rca1e5 {
            display: flex !important;
            flex-wrap: wrap !important;
            align-items: flex-start !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
        }

        /* Tabs take the full first line */
        body:has(.side-conversations-panel__open_4k6b2r) .ko-tabs__list_rca1e5 {
            flex: 1 1 100% !important;
            min-width: 0 !important;
        }

        /* Make the three tabs (org, user, subject) share width proportionally so
           they all truncate with an ellipsis together, instead of org/user
           keeping full width while only the subject gets cut off. Applies
           whether or not the side panel is open; when there's room, the tabs
           size to their content as normal. The ellipsis chain is carried through
           every nested element (li > span.item > a.link > span.subject) so the
           "…" actually appears rather than the text being hard-clipped. */
        .ko-tabs__list_rca1e5 > li {
            flex: 1 1 auto !important;
            min-width: 0 !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
        }
        .ko-tabs__list_rca1e5 > li > .ko-tabs_tab__item_oqn505 {
            flex: 1 1 auto !important;
            min-width: 0 !important;
        }
        .ko-tabs__list_rca1e5 > li .ko-tabs_tab__item_oqn505,
        .ko-tabs__list_rca1e5 > li .ko-tabs_tab__link_oqn505,
        .ko-tabs__list_rca1e5 > li .ko-tabs_case__subject_1cctzl {
            display: block !important;
            max-width: 100% !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
        }

        /* Everything from the id/Change Brand onward drops to its own line */
        body:has(.side-conversations-panel__open_4k6b2r) .ko-tabs__right_rca1e5 {
            flex: 1 1 100% !important;
            width: 100% !important;
            justify-content: flex-start !important;
            flex-wrap: wrap !important;
        }
    `;
    document.head.appendChild(style);
}

// --- HEADER WRAP FUNCTIONALITY ENDS HERE ---

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "resize") {
        resizeEditor(request.minHeight, request.maxHeight);
        chrome.storage.local.set({
            editorMinHeight: request.minHeight,
            editorMaxHeight: request.maxHeight
        });
    } else if (request.action === "resizeSideConversation") {
        resizeSideConversationEditor(request.minWidth, request.minHeight, request.maxHeight);
        chrome.storage.local.set({
            sideMinWidth: request.minWidth,
            sideMinHeight: request.minHeight,
            sideMaxHeight: request.maxHeight
        });
    } else if (request.action === "toggleEvents") {
        toggleEvents(request.hide);
    } else if (request.action === "toggleInternalNotes") {
        toggleInternalNotes(request.hide);
    } else if (request.action === "toggleDaySeparators") {
        toggleDaySeparators(request.hide);
    }
});

// Use a single MutationObserver to handle all dynamic changes
const observer = new MutationObserver(() => {
    // Apply sizes set from the popup
    applyAllEditorSizes();
    // Attach the interactive draggable listeners
    attachAllListeners();
});

// Start observing when the script loads
observer.observe(document.body, { childList: true, subtree: true });

// Also run once on initial load
applyAllEditorSizes();
attachAllListeners();

// Inject the header-wrap style (self-activates only while the side panel is open)
injectHeaderWrapStyle();

// Apply saved visibility states on load
chrome.storage.local.get(["hideEvents", "hideInternalNotes", "hideDates"], (data) => {
    if (data.hideEvents) {
        toggleEvents(true);
    }
    if (data.hideInternalNotes) {
        toggleInternalNotes(true);
    }
    if (data.hideDates) {
        toggleDaySeparators(true);
    }
});