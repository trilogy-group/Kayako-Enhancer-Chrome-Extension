document.addEventListener("DOMContentLoaded", function () {
    // Main editor elements
    let minSizeInput = document.getElementById("min-size");
    let maxSizeInput = document.getElementById("max-size");
    let applyButton = document.getElementById("apply");

    // Side conversation editor elements
    let sideMinWidthInput = document.getElementById("side-min-width");
    let sideMinHeightInput = document.getElementById("side-min-height");
    let sideMaxHeightInput = document.getElementById("side-max-height");
    let applySideButton = document.getElementById("apply-side");

    // Load stored values or set defaults for main editor
    chrome.storage.local.get(["editorMinHeight", "editorMaxHeight"], (data) => {
        minSizeInput.value = data.editorMinHeight || 44;
        maxSizeInput.value = data.editorMaxHeight || 600;
    });

    // Load stored values or set defaults for side conversation editor
    chrome.storage.local.get(["sideMinWidth", "sideMinHeight", "sideMaxHeight"], (data) => {
        sideMinWidthInput.value = data.sideMinWidth || 500;
        sideMinHeightInput.value = data.sideMinHeight || 100;
        sideMaxHeightInput.value = data.sideMaxHeight || 300;
    });

    // Main editor apply button
    applyButton.addEventListener("click", function () {
        let newMinSize = parseInt(minSizeInput.value, 10);
        let newMaxSize = parseInt(maxSizeInput.value, 10);

        if (newMinSize && newMaxSize) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: "resize", 
                    minHeight: newMinSize, 
                    maxHeight: newMaxSize 
                });
            });

            chrome.storage.local.set({ 
                editorMinHeight: newMinSize, 
                editorMaxHeight: newMaxSize 
            });
        }
    });

    // Side conversation editor apply button
    applySideButton.addEventListener("click", function () {
        let newMinWidth = parseInt(sideMinWidthInput.value, 10);
        let newMinHeight = parseInt(sideMinHeightInput.value, 10);
        let newMaxHeight = parseInt(sideMaxHeightInput.value, 10);

        if (newMinWidth && newMinHeight && newMaxHeight) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: "resizeSideConversation", 
                    minWidth: newMinWidth,
                    minHeight: newMinHeight, 
                    maxHeight: newMaxHeight 
                });
            });

            chrome.storage.local.set({ 
                sideMinWidth: newMinWidth,
                sideMinHeight: newMinHeight, 
                sideMaxHeight: newMaxHeight 
            });
        }
    });
});

