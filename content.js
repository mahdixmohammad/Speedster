let speedAmount;
let presetSpeeds;
let buttonsEnabled;
let keybindsEnabled;
let extensionEnabled;
const data = {};

// Function to update variables from storage
function updateVariablesFromStorage() {
    chrome.storage.sync.get(['key1', 'key2', 'key3', 'key4', 'key5'], (items) => {
        speedAmount = items.key1;
        presetSpeeds = items.key2;
        buttonsEnabled = items.key3;
        keybindsEnabled = items.key4;
        extensionEnabled = items.key5;

        data["key1"] = speedAmount;
        data["key2"] = presetSpeeds;
        data["key3"] = buttonsEnabled;
        data["key4"] = keybindsEnabled;
        data["key5"] = extensionEnabled;

        try {
            let videos = document.querySelectorAll("video");
            videos.forEach(video => {
                video.playbackRate = speedAmount;
            });
        }
        catch(error) {
            console.log(error.message);
        }
    });
}

// Initial call to populate variables
updateVariablesFromStorage();

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes) => {
    if (changes.key1 || changes.key2 || changes.key3 || changes.key4 || changes.key5) {
        updateVariablesFromStorage();
    }
});

document.addEventListener("keydown", (e) => {
    if (keybindsEnabled && extensionEnabled) {
        let selected = Number(e.key);
        if (e.altKey && selected >= 1 && selected <= 9) {
            try {
                speedAmount = presetSpeeds[selected - 1];
                data["key1"] = speedAmount;
                chrome.storage.sync.set(data);
                let videos = document.querySelectorAll("video");
                if (videos) {
                    videos.forEach(video => {
                        video.playbackRate = speedAmount;
                    })
                }
            }
            catch(error) {
                console.log(error.message);
            }
        }
    }
});

// Listen for DOM changes and adjust playback speed accordingly
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && document.querySelector("video")) {
            // New nodes (e.g., video elements) were added to the DOM
            try {
                let videos = document.querySelectorAll("video");
                videos.forEach(video => {
                    video.playbackRate = speedAmount;
                });
            }
            catch(error) {
                console.log(error.message);
            }
        }
    }
});

// Observe changes in the entire document
observer.observe(document, { childList: true, subtree: true });

// // Constantly refreshes all tabs with adjusted speed
// setInterval(() => {
//     if (document.querySelector("video")) {
//         try {
//             let videos = document.querySelectorAll("video");
//             videos.forEach(video => {
//                 video.playbackRate = speedAmount;
//             })
//         }
//         catch(error) {
//             console.log(error.message);
//         }
//     }
// }, 500)