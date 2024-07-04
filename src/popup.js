require("./popup.css");

("use strict");

// default values:
// let speedAmount = 1.00;
// let presetSpeeds = [0.50, 0.75, 1.00, 1.25, 1.50, 2.00, 3.00, 4.00, 16.00];
// let buttonsEnabled = true;
// let keybindsEnabled = true;
// let extensionEnabled = true;
// const data = {};

chrome.storage.sync.get(["key1", "key2", "key3", "key4", "key5"], result => {
	let speedAmount;
	let presetSpeeds;
	let buttonsEnabled;
	let keybindsEnabled;
	let extensionEnabled;
	const data = {};

	speedAmount = result.key1;
	presetSpeeds = result.key2;
	buttonsEnabled = result.key3;
	keybindsEnabled = result.key4;
	extensionEnabled = result.key5;

	data["key1"] = speedAmount;
	data["key2"] = presetSpeeds;
	data["key3"] = buttonsEnabled;
	data["key4"] = keybindsEnabled;
	data["key5"] = extensionEnabled;

	const speedElements = document.querySelectorAll(".speed");
	const custom = document.querySelector("input");
	const toggleKeybinds = document.querySelector(
		"#enable-keybinds .toggle-background"
	);
	const toggleExtension = document.querySelector(
		"#enable-extension .toggle-background"
	);
	const elements = document.querySelectorAll(
		".wrapper :not(.exception, .exception *), #reset"
	);
	let current;
	let currentlyTyping = false;

	// initializing action badge
	chrome.action.setBadgeText({ text: speedAmount.toFixed(2) });

	// initializing popup speed buttons
	setSpeedButtons();

	// initializing toggle button settings
	if (!keybindsEnabled) {
		toggleKeybinds.classList.remove("active");
		document.querySelector("#keys-state").textContent = "OFF";
	}
	if (!extensionEnabled) {
		toggleExtension.classList.remove("active");
		document.querySelector("#extension-state").textContent = "OFF";
		adjustSpeed(1);
		if (current) current.classList.remove("active");

		// css disable extension
		elements.forEach(element => {
			element.style.pointerEvents = "none";
			element.style.filter = "grayscale(100%) opacity(75%)";
		});
	}

	// initializing video playback speed
	adjustSpeed(speedAmount);

	// initializing popup input value
	custom.value = speedAmount.toFixed(2);

	speedElements.forEach(speedElement => {
		speedElement.addEventListener("click", () => {
			if (buttonsEnabled) {
				if (current) current.classList.remove("active");
				current = speedElement;
				current.classList.add("active");
				adjustSpeed(speedElement.textContent);
			}
		});
	});

	// ensures that typing does not switch to preset speed
	custom.addEventListener("focusin", () => {
		keybindsEnabled = false;
	});

	custom.addEventListener("focusout", () => {
		keybindsEnabled = true;
	});

	// user types in custom input
	custom.addEventListener("keyup", () => {
		currentlyTyping = true;
		if (current) current.classList.remove("active");
		if (custom.value && custom.value != speedAmount) {
			if (Number(custom.value < 0)) adjustSpeed(0);
			else if (Number(custom.value > 16)) adjustSpeed(16);
			else adjustSpeed(Number(custom.value));
		}
	});

	// user submits custom input
	custom.addEventListener("change", () => {
		currentlyTyping = false;
		adjustSpeed(custom.value);
		if (!custom.value) {
			adjustSpeed(0);
		}
	});

	// left arrow key custom decrease
	const leftArrow = document.querySelector("#small-dec");
	leftArrow.addEventListener("click", () => {
		if (current) current.classList.remove("active");
		if (speedAmount > 0.1) adjustSpeed(speedAmount - 0.1);
		else if (speedAmount === 0.1) adjustSpeed(0);
	});

	// right arrow key custom increase
	const rightArrow = document.querySelector("#small-inc");
	rightArrow.addEventListener("click", () => {
		if (current) current.classList.remove("active");
		if (speedAmount <= 15.9) adjustSpeed(speedAmount + 0.1);
	});

	// double left arrow key custom decrease
	const doubleLeftArrow = document.querySelector(".double-left-arrow");
	doubleLeftArrow.addEventListener("click", () => {
		if (current) current.classList.remove("active");
		if (speedAmount > 1) adjustSpeed(speedAmount - 1);
		else if (speedAmount === 1) adjustSpeed(0);
	});

	// double right arrow key custom increase
	const doubleRightArrow = document.querySelector(".double-right-arrow");
	doubleRightArrow.addEventListener("click", () => {
		if (current) current.classList.remove("active");
		if (speedAmount <= 15) adjustSpeed(speedAmount + 1);
	});

	// key bindings to select speed
	document.addEventListener("keydown", e => {
		if (keybindsEnabled && extensionEnabled) {
			let selected = Number(e.key);
			if (selected <= 9 && selected >= 1) {
				let speedElement = document.querySelector(
					`.speed:nth-child(${selected})`
				);
				if (current) current.classList.remove("active");
				current = speedElement;
				current.classList.add("active");
				adjustSpeed(speedElement.textContent);
			}
		}
	});

	// toggle keybinds button
	toggleKeybinds.addEventListener("click", () => {
		toggleKeybinds.classList.toggle("active");
		if (toggleKeybinds.classList.contains("active")) {
			document.querySelector("#keys-state").textContent = "ON";
			keybindsEnabled = true;
			data["key4"] = keybindsEnabled;
			chrome.storage.sync.set(data);
		} else {
			document.querySelector("#keys-state").textContent = "OFF";
			keybindsEnabled = false;
			data["key4"] = keybindsEnabled;
			chrome.storage.sync.set(data);
		}
	});

	// toggle extension button
	toggleExtension.addEventListener("click", () => {
		toggleExtension.classList.toggle("active");
		if (toggleExtension.classList.contains("active")) {
			document.querySelector("#extension-state").textContent = "ON";
			extensionEnabled = true;
			data["key5"] = extensionEnabled;
			chrome.storage.sync.set(data);
			// css enable extension
			elements.forEach(element => {
				element.style.pointerEvents = "auto";
				element.style.filter = "none";
			});
		} else {
			document.querySelector("#extension-state").textContent = "OFF";
			adjustSpeed(1);
			if (current) current.classList.remove("active");
			extensionEnabled = false;
			data["key5"] = extensionEnabled;
			chrome.storage.sync.set(data);
			// css disable extension
			elements.forEach(element => {
				element.style.pointerEvents = "none";
				element.style.filter = "grayscale(100%) opacity(75%)";
			});
		}
	});

	// edit button
	document.querySelector("#edit").addEventListener("click", () => {
		let i = 0;
		speedElements.forEach(speedElement => {
			speedElement.classList.remove("active");
			speedElement.classList.toggle("editable");
			speedElement.toggleAttribute("contenteditable");
			if (speedElement.classList.contains("editable")) {
				keybindsEnabled = false;
				buttonsEnabled = false;
			} else {
				if (toggleKeybinds.classList.contains("active"))
					keybindsEnabled = true;
				buttonsEnabled = true;
				presetSpeeds[i] = Number(speedElements[i].textContent);
			}
			i += 1;
			data["key2"] = presetSpeeds;
			chrome.storage.sync.set(data);
		});
	});

	speedElements.forEach(speedElement => {
		const invalidKeys = [
			"Enter",
			" ",
			"!",
			"@",
			"#",
			"$",
			"%",
			"^",
			"&",
			"*",
			"(",
			")",
		];
		const validKeys = [
			"Backspace",
			"ArrowDown",
			"ArrowUp",
			"ArrowLeft",
			"ArrowRight",
		];

		speedElement.addEventListener("keydown", function (e) {
			// only one decimal is allowed
			if (speedElement.textContent.includes(".")) {
				invalidKeys.push(".");
				const index = validKeys.indexOf(".");
				if (index > -1) validKeys.splice(index, 1);
			}
			// no decimal in text means decimal is a valid key
			else {
				validKeys.push(".");
				const index = invalidKeys.indexOf(".");
				if (index > -1) invalidKeys.splice(index, 1);
			}
			// user can only type numbers or press valid keys
			if (
				(isNaN(String.fromCharCode(e.which)) ||
					invalidKeys.includes(e.key)) &&
				!validKeys.includes(e.key)
			) {
				e.preventDefault();
			}
		});

		speedElement.addEventListener("focusout", () => {
			speedElement.textContent = parseFloat(
				speedElement.textContent
			).toFixed(2);
			if (Number(speedElement.textContent) > 16)
				speedElement.textContent = "16.00";
			if (Number(speedElement.textContent) < 0)
				speedElement.textContent = "0.00";
		});
	});

	// reset button
	document.querySelector("#reset").addEventListener("click", () => {
		adjustSpeed(1);
		presetSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 16];
		data["key2"] = presetSpeeds;
		chrome.storage.sync.set(data);
		if (current) current.classList.remove("active");
		setSpeedButtons();

		speedElements.forEach(speedElement => {
			if (speedElement.classList.contains("editable")) {
				if (toggleKeybinds.classList.contains("active"))
					keybindsEnabled = true;
				buttonsEnabled = true;
				speedElement.classList.remove("editable");
				speedElement.removeAttribute("contenteditable");
			}
		});
	});

	function adjustSpeed(newSpeed) {
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
