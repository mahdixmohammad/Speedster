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

// Retrieve stored variables from storage
chrome.storage.sync.get(["key1", "key2", "key3", "key4", "key5"], (result: DataObject): void => {
	// Check if the entire object exists in storage
	if (result) {
		// Initialize variables from storage or use default values
		speedAmount = result.key1 !== undefined ? result.key1 : 1;
		presetSpeeds = result.key2 !== undefined ? result.key2 : [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 16];
		buttonsEnabled = result.key3 !== undefined ? result.key3 : true;
		keybindsEnabled = result.key4 !== undefined ? result.key4 : true;
		extensionEnabled = result.key5 !== undefined ? result.key5 : true;
	} else {
		// Initialize with default values
		speedAmount = 1;
		presetSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 16];
		buttonsEnabled = true;
		keybindsEnabled = true;
		extensionEnabled = true;
	}

	// Store variables in storage (if not already present)
	data["key1"] = speedAmount;
	data["key2"] = presetSpeeds;
	data["key3"] = buttonsEnabled;
	data["key4"] = keybindsEnabled;
	data["key5"] = extensionEnabled;

	chrome.action.setBadgeText({ text: speedAmount.toFixed(2) });
	chrome.storage.sync.set(data);

	// Listen for changes in storage
	chrome.storage.onChanged.addListener((changes: DataObject): void => {
		if (changes.key1 || changes.key2 || changes.key3 || changes.key4 || changes.key5) {
			chrome.storage.sync.get("key1", (result: DataObject): void => {
				speedAmount = result.key1!;
				chrome.action.setBadgeText({
					text: speedAmount.toFixed(2),
				});
			});
		}
	});

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		if (changeInfo.status === "complete") {
			chrome.action.setBadgeText({ text: speedAmount.toFixed(2) });
		}
	});
});

export {};
