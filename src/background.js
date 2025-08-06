import { defaultSettings } from './settings.js';

console.table(defaultSettings);

// Set default settings on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(defaultSettings, (settings) => {
        chrome.storage.sync.set(settings);
    });
});
