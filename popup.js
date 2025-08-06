/** @type {(keys: string[], callback: (result: object) => void) => void} */
const get = chrome.storage.sync.get
/** @type {(result: object) => void} */
const set = chrome.storage.sync.set

document.addEventListener('DOMContentLoaded', () => {
    const extensionEnabledCheckbox = document.getElementById('extensionEnabled');
    const extremeBauBauCheckbox    = document.getElementById('extremeBauBau');

    get(['extensionEnabled', 'extremeBauBau'], (result) => {
        // Default to true if not set
        extensionEnabledCheckbox?.checked =
            typeof result.extensionEnabled === 'undefined' ? true : result.extensionEnabled;
        // Default to false if not set
        extremeBauBauCheckbox?.checked = result.extremeBauBau === true;
    });

    extensionEnabledCheckbox?.addEventListener('change', (event) => {
        set({ extensionEnabled: event.target?.checked });
    });

    extremeBauBauCheckbox?.addEventListener('change', (event) => {
        set({ extremeBauBau: event.target?.checked });
    });
});
