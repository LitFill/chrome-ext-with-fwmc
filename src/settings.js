/**
 * @typedef {object} Settings
 * @property {boolean} extensionEnabled
 * @property {boolean} extremeBauBau
 */

/** @type {Settings} */
export const defaultSettings = {
    extensionEnabled: true,
    extremeBauBau:    false,
};

/**
 * @param {(settings: Settings) => void} callback
 */
export function getSettings(callback) {
    chrome.storage.sync.get(defaultSettings, (settings) => {
        callback(settings);
    });
}

/**
 * @param {Partial<Settings>} newSettings
 */
export function setSettings(newSettings) {
    chrome.storage.sync.set(newSettings);
}
