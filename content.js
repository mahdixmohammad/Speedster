let speedAmount;
let presetSpeeds;
let buttonsEnabled;
let keybindsEnabled;
let extensionEnabled;
const data = {};

// Function to update variables from storage
function updateVariablesFromStorage() {
    chrome.storage.local.get(['key1', 'key2', 'key3', 'key4', 'key5'], (items) => {
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

// Constantly refreshes with adjusted speed
setInterval(() => {
    if (document.querySelector("video")) {
        let videos = document.querySelectorAll("video");
        videos.forEach(video => {
            video.playbackRate = speedAmount;
        })
    }
}, 500)

document.addEventListener("keydown", (e) => {
    if (keybindsEnabled && extensionEnabled) {
        let selected = Number(e.key);
        if (e.altKey && selected >= 1 && selected <= 9) {
            speedAmount = presetSpeeds[selected - 1];
            data["key1"] = speedAmount;
            chrome.storage.local.set(data);
            let videos = document.querySelectorAll("video");
            if (videos) {
                videos.forEach(video => {
                    video.playbackRate = speedAmount;
                })
            }
        }
    }
});