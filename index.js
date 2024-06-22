"use strict"

// default values:
// let speedAmount = 1.00;
// let presetSpeeds = [0.50, 0.75, 1.00, 1.25, 1.50, 2.00, 3.00, 4.00, 16.00];
// let buttonsEnabled = true;
// let keybindsEnabled = true;
// let extensionEnabled = true;
// const data = {};

let speedAmount;
let presetSpeeds;
let buttonsEnabled;
let keybindsEnabled;
let extensionEnabled;
const data = {};

chrome.storage.local.get(['key1', 'key2', 'key3', 'key4', 'key5'], (result) => {
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
    const toggleKeybinds = document.querySelector("#enable-keybinds .toggle-background");
    const toggleExtension = document.querySelector("#enable-extension .toggle-background");
    const elements = document.querySelectorAll(".wrapper :not(.exception, .exception *), #reset");
    let current;

    // initializing action badge
    chrome.action.setBadgeText({ text: speedAmount.toFixed(2).toString() });

    // initializing popup speed buttons
    for (let i = 0; i < speedElements.length; i++) {
        speedElements[i].textContent = presetSpeeds[i].toFixed(2).toString();
        if (speedElements[i].textContent == speedAmount.toFixed(2).toString()) {
            speedElements[i].classList.add("active");
            current = speedElements[i];
        }
    }

    // initializing popup input value
    custom.value = speedAmount.toFixed(2);

    // initializing toggle button settings
    if (!keybindsEnabled) {
        toggleKeybinds.classList.remove("active");
        document.querySelector("#keys-state").textContent = "OFF";
    }
    if (!extensionEnabled) {
        toggleExtension.classList.remove("active");
        document.querySelector("#extension-state").textContent = "OFF";
        adjustSpeed(1);
        custom.value = parseFloat(custom.value).toFixed(2);
        if (current) current.classList.remove("active");

        // css disable extension
        elements.forEach((element) => {
            element.style.pointerEvents = "none";
            element.style.filter = "grayscale(100%) opacity(75%)";
        });
    }

    // initializing video playback speed
    adjustSpeed(speedAmount);
    
    function injectScript(speedAmount) {
        let videos = document.querySelectorAll("video");
        if (videos) {
            videos.forEach(video => {
                video.playbackRate = speedAmount;
            })
        }
    }

    async function adjustSpeed(newSpeed) {
        speedAmount = Number(newSpeed.toFixed(2));
        if (speedAmount < 0.1 && speedAmount >= 0.01) speedAmount = 0.1;
        custom.value = speedAmount;
        data["key1"] = speedAmount;
        chrome.storage.local.set(data);

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            await chrome.scripting.executeScript({
                args: [speedAmount],
                target: { tabId: tab.id },
                func: injectScript,
            });
    }

    speedElements.forEach(speedElement => {
        speedElement.addEventListener("click", () => {
            if (buttonsEnabled) {
                if (current) current.classList.remove("active");
                current = speedElement;
                current.classList.add("active");
                adjustSpeed(Number(speedElement.textContent));
                custom.value = parseFloat(custom.value).toFixed(2);
            }
        });
    });

    custom.addEventListener("focusin", () => {
        keybindsEnabled = false;
    })

    custom.addEventListener("focusout", () => {
        keybindsEnabled = true;
    })

    custom.addEventListener("keyup", () => {
        if (current) current.classList.remove("active");
        if (custom.value && custom.value != speedAmount) {
            if (Number(custom.value < 0)) adjustSpeed(0);
            else if (Number(custom.value > 16)) adjustSpeed(16);
            else adjustSpeed(Number(custom.value));
        }
    })

    custom.addEventListener("change", () => {
        custom.value = parseFloat(custom.value).toFixed(2);
        if (!custom.value) {
            adjustSpeed(0.00);
            custom.value = parseFloat(0.00).toFixed(2);
        }
    })

    // left arrow key custom decrease
    const leftArrow = document.querySelector("#small-dec");
    leftArrow.addEventListener("click", () => {
        if (current) current.classList.remove("active");
        if (speedAmount > 0.1) adjustSpeed(speedAmount - 0.1);
        else if (speedAmount === 0.1) adjustSpeed(0.00)
        custom.value = parseFloat(custom.value).toFixed(2);
    })

    // right arrow key custom increase
    const rightArrow = document.querySelector("#small-inc");
    rightArrow.addEventListener("click", () => {
        if (current) current.classList.remove("active");
        if (speedAmount <= 15.9) adjustSpeed(speedAmount + 0.1);
        custom.value = parseFloat(custom.value).toFixed(2);
    })

    // double left arrow key custom decrease
    const doubleLeftArrow = document.querySelector(".double-left-arrow");
    doubleLeftArrow.addEventListener("click", () => {
        if (current) current.classList.remove("active");
        if (speedAmount > 1) adjustSpeed(speedAmount - 1);
        else if (speedAmount === 1) adjustSpeed(0.00)
        custom.value = parseFloat(custom.value).toFixed(2);
    })

    // double right arrow key custom increase
    const doubleRightArrow = document.querySelector(".double-right-arrow");
    doubleRightArrow.addEventListener("click", () => {
        if (current) current.classList.remove("active");
        if (speedAmount <= 15) adjustSpeed(speedAmount + 1);
        custom.value = parseFloat(custom.value).toFixed(2);
    })

    // key bindings to select speed
    document.addEventListener("keydown", (e) => {
        if (keybindsEnabled && extensionEnabled) {
            let selected = Number(e.key);
            if (selected <= 9 && selected >= 1) {
                let speedElement = document.querySelector(`.speed:nth-child(${selected})`);
                if (current) current.classList.remove("active");
                current = speedElement;
                current.classList.add("active");
                adjustSpeed(Number(speedElement.textContent));
                custom.value = parseFloat(custom.value).toFixed(2);
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
            chrome.storage.local.set(data);
        }
        else {
            document.querySelector("#keys-state").textContent = "OFF";
            keybindsEnabled = false;
            data["key4"] = keybindsEnabled;
            chrome.storage.local.set(data);
        }
    })

    // toggle extension button
    toggleExtension.addEventListener("click", () => {
        toggleExtension.classList.toggle("active");
        if (toggleExtension.classList.contains("active")) {
            document.querySelector("#extension-state").textContent = "ON";
            extensionEnabled = true;
            data["key5"] = extensionEnabled;
            chrome.storage.local.set(data);
            // css enable extension
            elements.forEach((element) => {
                element.style.pointerEvents = "auto";
                element.style.filter = "none";
                });
        }
        else {
            document.querySelector("#extension-state").textContent = "OFF";
            adjustSpeed(1);
            custom.value = parseFloat(custom.value).toFixed(2);
            if (current) current.classList.remove("active");
            extensionEnabled = false;
            data["key5"] = extensionEnabled;
            chrome.storage.local.set(data);
            // css disable extension
            elements.forEach((element) => {
                element.style.pointerEvents = "none";
                element.style.filter = "grayscale(100%) opacity(75%)";
            });
        }
    })

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
            }
            else {
                if (toggleKeybinds.classList.contains("active")) keybindsEnabled = true;
                buttonsEnabled = true;
                presetSpeeds[i] = Number(speedElements[i].textContent);
            }
            i += 1;
            data["key2"] = presetSpeeds;
            chrome.storage.local.set(data);
        })

    })

    speedElements.forEach(speedElement => {
        const invalidKeys = ["Enter", " ", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
        const validKeys = ["Backspace", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];

        speedElement.addEventListener("keydown", function(e) {
            // only one decimal is allowed
            if (speedElement.textContent.includes("."))
            {
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
            if ((isNaN(String.fromCharCode(e.which))
                || invalidKeys.includes(e.key)) 
                && !validKeys.includes(e.key)) {
                e.preventDefault()
            }
        });

        speedElement.addEventListener("focusout", () => {
            speedElement.textContent = parseFloat(Number(speedElement.textContent)).toFixed(2)
            if (Number(speedElement.textContent) > 16) speedElement.textContent = "16.00";
            if (Number(speedElement.textContent) < 0) speedElement.textContent = "0.00";
        })
    })

    // reset button
    document.querySelector("#reset").addEventListener("click", () => {
        adjustSpeed(1);
        presetSpeeds = [0.50, 0.75, 1.00, 1.25, 1.50, 2.00, 3.00, 4.00, 16.00];
        data["key2"] = presetSpeeds;
        chrome.storage.local.set(data);
        custom.value = parseFloat(custom.value).toFixed(2);
        if (current) current.classList.remove("active");
        current = document.querySelector(".speed:nth-child(3)");
        current.classList.add("active");
        document.querySelector(".speed:nth-child(1)").textContent = "0.50";
        document.querySelector(".speed:nth-child(2)").textContent = "0.75";
        document.querySelector(".speed:nth-child(3)").textContent = "1.00";
        document.querySelector(".speed:nth-child(4)").textContent = "1.25";
        document.querySelector(".speed:nth-child(5)").textContent = "1.50";
        document.querySelector(".speed:nth-child(6)").textContent = "2.00";
        document.querySelector(".speed:nth-child(7)").textContent = "3.00";
        document.querySelector(".speed:nth-child(8)").textContent = "4.00";
        document.querySelector(".speed:nth-child(9)").textContent = "16.00";

        speedElements.forEach(speedElement => {
            if (speedElement.classList.contains("editable")) {
                if (toggleKeybinds.classList.contains("active")) keybindsEnabled = true;
                buttonsEnabled = true;
                speedElement.classList.remove("editable");
                speedElement.removeAttribute("contenteditable");
            }
        })
    })
})