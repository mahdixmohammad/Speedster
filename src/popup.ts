require("./popup.css");

("use strict");

// default values:
// let speedAmount = 1.00;
// let presetSpeeds = [0.50, 0.75, 1.00, 1.25, 1.50, 2.00, 3.00, 4.00, 16.00];
// let buttonsEnabled = true;
// let keybindsEnabled = true;
// let extensionEnabled = true;
// const data = {};

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

chrome.storage.sync.get(["key1", "key2", "key3", "key4", "key5"], result => {
	data["key1"] = speedAmount = result.key1;
	data["key2"] = presetSpeeds = result.key2;
	data["key3"] = buttonsEnabled = result.key3;
	data["key4"] = keybindsEnabled = result.key4;
	data["key5"] = extensionEnabled = result.key5;

	const speedElements: NodeListOf<HTMLElement> = document.querySelectorAll(".speed")!;
	const custom: HTMLInputElement = document.querySelector("input")!;
	const toggleKeybinds: HTMLElement = document.querySelector("#enable-keybinds .toggle-background")!;
	const toggleExtension: HTMLElement = document.querySelector("#enable-extension .toggle-background")!;
	const elements: NodeListOf<HTMLElement> = document.querySelectorAll(".wrapper :not(.exception, .exception *), #reset");
	let current: HTMLElement;
	let currentlyTyping: boolean = false;

	// initializing action badge
	chrome.action.setBadgeText({ text: speedAmount.toFixed(2) });

	// initializing popup speed buttons
	setSpeedButtons();

	// initializing toggle button settings
	if (!keybindsEnabled) {
		toggleKeybinds.classList.remove("active");
		document.querySelector("#keys-state")!.textContent = "OFF";
	}
	if (!extensionEnabled) {
		toggleExtension.classList.remove("active");
		document.querySelector("#extension-state")!.textContent = "OFF";
		adjustSpeed(1);
		if (current!) current.classList.remove("active");

		// css disable extension
		elements.forEach((element: HTMLElement): void => {
			element.style.pointerEvents = "none";
			element.style.filter = "grayscale(100%) opacity(75%)";
		});
	}

	// initializing video playback speed
	adjustSpeed(speedAmount);

	// initializing popup input value
	custom.value = speedAmount.toFixed(2);

	speedElements.forEach((speedElement: HTMLElement) => {
		speedElement.addEventListener("click", (): void => {
			if (buttonsEnabled) {
				if (current) current.classList.remove("active");
				current = speedElement;
				current.classList.add("active");
				adjustSpeed(speedElement.textContent!);
			}
		});
	});

	// ensures that typing does not switch to preset speed
	custom.addEventListener("focusin", (): void => {
		keybindsEnabled = false;
	});

	custom.addEventListener("focusout", (): void => {
		keybindsEnabled = true;
	});

	// user types in custom input
	custom.addEventListener("keyup", (): void => {
		currentlyTyping = true;
		if (current) current.classList.remove("active");
		if (custom.value && custom.value != speedAmount.toString()) {
			if (Number(custom.value) < 0) adjustSpeed(0);
			else if (Number(custom.value) > 16) adjustSpeed(16);
			else adjustSpeed(Number(custom.value));
		}
	});

	// user submits custom input
	custom.addEventListener("change", (): void => {
		currentlyTyping = false;
		adjustSpeed(custom.value);
		if (!custom.value) {
			adjustSpeed(0);
		}
	});

	// left arrow key custom decrease
	const leftArrow: HTMLElement = document.querySelector("#small-dec")!;
	leftArrow.addEventListener("click", (): void => {
		if (current) current.classList.remove("active");
		if (speedAmount > 0.1) adjustSpeed(speedAmount - 0.1);
		else if (speedAmount === 0.1) adjustSpeed(0);
	});

	// right arrow key custom increase
	const rightArrow: HTMLElement = document.querySelector("#small-inc")!;
	rightArrow.addEventListener("click", (): void => {
		if (current) current.classList.remove("active");
		if (speedAmount <= 15.9) adjustSpeed(speedAmount + 0.1);
	});

	// double left arrow key custom decrease
	const doubleLeftArrow: HTMLElement = document.querySelector(".double-left-arrow")!;
	doubleLeftArrow.addEventListener("click", () => {
		if (current) current.classList.remove("active");
		if (speedAmount > 1) adjustSpeed(speedAmount - 1);
		else if (speedAmount === 1) adjustSpeed(0);
	});

	// double right arrow key custom increase
	const doubleRightArrow: HTMLElement = document.querySelector(".double-right-arrow")!;
	doubleRightArrow.addEventListener("click", () => {
		if (current) current.classList.remove("active");
		if (speedAmount <= 15) adjustSpeed(speedAmount + 1);
	});

	// key bindings to select speed
	document.addEventListener("keydown", (e: KeyboardEvent): void => {
		if (keybindsEnabled && extensionEnabled) {
			let selected: number = Number(e.key);
			if (selected <= 9 && selected >= 1) {
				let speedElement: HTMLElement = document.querySelector(`.speed:nth-child(${selected})`)!;
				if (current) current.classList.remove("active");
				current = speedElement;
				current.classList.add("active");
				adjustSpeed(speedElement.textContent!);
			}
		}
	});

	const toggleButtonMap: Map<boolean, string> = new Map([
		[true, "ON"],
		[false, "OFF"],
	]);

	// toggle keybinds button
	toggleKeybinds.addEventListener("click", (): void => {
		toggleKeybinds.classList.toggle("active");
		keybindsEnabled = !keybindsEnabled;
		const keysState: HTMLElement = document.querySelector("#keys-state")!;
		keysState.textContent = toggleButtonMap.get(keybindsEnabled)!;
		data["key4"] = keybindsEnabled;
		chrome.storage.sync.set(data);
	});

	// toggle extension button
	toggleExtension.addEventListener("click", (): void => {
		toggleExtension.classList.toggle("active");
		extensionEnabled = !extensionEnabled;
		const extensionState: HTMLElement = document.querySelector("#extension-state")!;
		extensionState.textContent = toggleButtonMap.get(keybindsEnabled)!;
		data["key5"] = extensionEnabled;
		chrome.storage.sync.set(data);

		// css enable / disable extension
		elements.forEach((element: HTMLElement): void => {
			element.style.pointerEvents = extensionEnabled ? "auto" : "none";
			element.style.filter = extensionEnabled ? "none" : "grayscale(100%) opacity(75%)";
		});

		if (!extensionEnabled) {
			adjustSpeed(1);
			if (current) current.classList.remove("active");
		}
	});

	// edit button
	const editButton: HTMLImageElement = document.querySelector("#edit")!;
	editButton!.addEventListener("click", (): void => {
		editButton.classList.toggle("active");
		let i = 0;
		speedElements.forEach((speedElement: HTMLElement): void => {
			speedElement.classList.remove("active");
			speedElement.classList.toggle("editable");
			speedElement.toggleAttribute("contenteditable");
			if (speedElement.classList.contains("editable")) {
				keybindsEnabled = false;
				buttonsEnabled = false;
			} else {
				if (toggleKeybinds.classList.contains("active")) keybindsEnabled = true;
				buttonsEnabled = true;
				presetSpeeds[i] = Number(speedElements[i].textContent);
			}
			i += 1;
			data["key2"] = presetSpeeds;
			chrome.storage.sync.set(data);
		});
	});

	speedElements.forEach((speedElement: HTMLElement): void => {
		const invalidKeys = ["Enter", " ", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
		const validKeys = ["Backspace", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];

		speedElement.addEventListener("keydown", (e: KeyboardEvent): void => {
			// only one decimal is allowed
			if (speedElement.textContent!.includes(".")) {
				invalidKeys.push(".");
				const index: number = validKeys.indexOf(".");
				if (index > -1) validKeys.splice(index, 1);
			}
			// no decimal in text means decimal is a valid key
			else {
				validKeys.push(".");
				const index: number = invalidKeys.indexOf(".");
				if (index > -1) invalidKeys.splice(index, 1);
			}
			// user can only type numbers or press valid keys
			if ((isNaN(Number(String.fromCharCode(e.which))) || invalidKeys.includes(e.key)) && !validKeys.includes(e.key)) {
				e.preventDefault();
			}
		});

		speedElement.addEventListener("focusout", () => {
			speedElement.textContent = parseFloat(speedElement.textContent!).toFixed(2);
			if (Number(speedElement.textContent) > 16) speedElement.textContent = "16.00";
			if (Number(speedElement.textContent) < 0) speedElement.textContent = "0.00";
			if (speedElement.textContent === "NaN") speedElement.textContent = "1.00";
		});
	});

	// reset button
	document.querySelector("#reset")!.addEventListener("click", (): void => {
		adjustSpeed(1);
		presetSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 16];
		data["key2"] = presetSpeeds;
		chrome.storage.sync.set(data);
		if (current) current.classList.remove("active");
		setSpeedButtons();

		speedElements.forEach((speedElement: HTMLElement): void => {
			if (speedElement.classList.contains("editable")) {
				if (toggleKeybinds.classList.contains("active")) keybindsEnabled = true;
				buttonsEnabled = true;
				speedElement.classList.remove("editable");
				speedElement.removeAttribute("contenteditable");
			}
		});
	});

	function adjustSpeed(newSpeed: string | number) {
		speedAmount = Number(newSpeed);
		if (speedAmount < 0.1 && speedAmount >= 0.01) speedAmount = 0.1;
		if (!currentlyTyping) custom.value = speedAmount.toFixed(2);
		data["key1"] = speedAmount;
		chrome.storage.sync.set(data);
	}

	function setSpeedButtons() {
		for (let i = 0; i < speedElements.length; i++) {
			speedElements[i].textContent = presetSpeeds[i].toFixed(2);
			if (speedElements[i].textContent == speedAmount.toFixed(2)) {
				speedElements[i].classList.add("active");
				current = speedElements[i];
			}
		}
	}
});
