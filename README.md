# **Speedster Chrome / Edge Extension**

## About

Speedster is a browser extension for Google Chrome and Microsoft Edge that allows users to adjust the playback speed of videos across all
tabs. With a simple and intuitive interface, Speedster provides customizable speed settings. Whether you want to skip ads, optimize
entertainment pacing, or breeze through lectures, Speedster has you covered!

## Installation (for Microsoft Edge only)

1. **Download Speedster on Microsoft Edge**

    - Go to https://microsoftedge.microsoft.com/addons/detail/speedster/cmagfffhjnenimfapiblgiipgonllcef and click the **Get** button to install in the browser.

2. **Activate Speedster**
    - Click the extensions button next to the search bar.
    - Pin the Speedster extension and open it.

## Installation (via GitHub)

1. **Ensure you have Node v18+ installed**

    - Go to https://nodejs.org/en/download/package-manager and download the version you want.

2. **Download the repository**

    - Clone or download the repository to your local machine.

3. **Install necessary dependencies**

    - Run the command `npm install` in your CLI.

4. **Build the production version**

    - Run the command `npm run build` in your CLI to create production optimized files.

5. **Enable Developer Mode**

    - Open your browser settings and navigate to extensions.
    - Enable developer mode.

6. **Load the extension**

    - Click the "Load unpacked" button in the extensions settings.
    - Open the repository location on your local machine and then select the dist folder.

7. **Activate Speedster**
    - Click the extensions button next to the search bar.
    - Pin the Speedster extension and open it.

## How to Use

The video's playback speed can only be modified to be between 0 - 16 due to browser limitations.
The following are the available features that you can use to adjust the speed:

-   Click any of the preset speed buttons (which can be customized).
-   Manually type in the desired speed in the centered input box located underneath the preset speed buttons.
-   Use the single arrow buttons beside the input box to change the speed by 0.10 (left decreases by 0.10, right increases by 0.10).
-   Use the double arrow buttons beside the single arrows to change the speed by 1.00 (left decreases by 1.00, right increases by 1.00).
-   While the extension popup is open, pressing the 1 through 9 keys on your keyboard allows you to quickly switch between presets.
-   While outside the extension popup, pressing the "Alt" key plus 1 through 9 keys on your keyboard allows you to quickly switch between presets.
-   The toggle keybinds button enables / disables whether you want to able to switch through presets using your keyboard.
-   The toggle extension button enables / disables the extension and hence resets the playback speed to 1.00.
-   The pencil icon allows you to edit all the preset speed buttons and save them in the extension. Simply click the icon and then click on any of
    the buttons to type in a new speed.
-   The reset icon resets the extension (including the speed and presets) to default.
