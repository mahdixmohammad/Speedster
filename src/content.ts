"use strict";

let speedAmount: number;
let presetSpeeds: number[];
let buttonsEnabled: boolean;
let keybindsEnabled: boolean;
let extensionEnabled: boolean;

interface DataObject {
	key1?: number;
	key2?: number[];
	key3?: boolean;
	key4?: boolean;
	key5?: boolean;
}

const data: DataObject = {};

// Function to update variables from storage
function updateVariablesFromStorage() {
	chrome.storage.sync.get(["key1", "key2", "key3", "key4", "key5"], (items: DataObject): void => {
		speedAmount = items.key1!;
		presetSpeeds = items.key2!;
		buttonsEnabled = items.key3!;
		keybindsEnabled = items.key4!;
		extensionEnabled = items.key5!;

		data["key1"] = speedAmount;
		data["key2"] = presetSpeeds;
		data["key3"] = buttonsEnabled;
		data["key4"] = keybindsEnabled;
		data["key5"] = extensionEnabled;

		applySpeedToAllVideos();
	});
}

// Function to apply speed to all videos and disable native playback controls
function applySpeedToAllVideos() {
	try {
		let videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll("video");
		videos.forEach((video: HTMLVideoElement): void => {
			video.playbackRate = speedAmount;

			// Disable the native playback controls
			video.controls = false;

			// Continuously monitor and reset playbackRate if changed
			const resetSpeed = () => {
				if (video.playbackRate !== speedAmount) {
					video.playbackRate = speedAmount;
				}
			};

			// Listen for any changes to playbackRate
			video.addEventListener("ratechange", resetSpeed);
		});
	} catch (error: any) {
		console.log(error.message);
	}
}

// Initial call to populate variables
updateVariablesFromStorage();

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes: DataObject) => {
	if (changes.key1 || changes.key2 || changes.key3 || changes.key4 || changes.key5) {
		updateVariablesFromStorage();
	}
});

document.addEventListener("keydown", e => {
	if (keybindsEnabled && extensionEnabled) {
		let selected = Number(e.key);
		if (e.altKey && selected >= 1 && selected <= 9) {
			try {
				speedAmount = presetSpeeds[selected - 1];
				data["key1"] = speedAmount;
				chrome.storage.sync.set(data);
				applySpeedToAllVideos();
			} catch (error: any) {
				console.log(error.message);
			}
		}
	}
});

// Listen for DOM changes and adjust playback speed accordingly
const observer = new MutationObserver(mutationsList => {
	for (const mutation of mutationsList) {
		if (mutation.type === "childList" && mutation.addedNodes.length > 0 && document.querySelector("video")) {
			// New nodes (e.g., video elements) were added to the DOM
			applySpeedToAllVideos();
		}
	}
});

// Observe changes in the entire document
observer.observe(document, { childList: true, subtree: true });

export {};
