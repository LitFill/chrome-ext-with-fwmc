import { defaultSettings } from './settings.js';

const DEBUG = true;
const logger = (location) => (...args) => {
    if (DEBUG) {
        console.log(`[FWMC Background] ${location}:`, ...args);
    }
};

const log = logger('main');

log('Background script loaded. Default settings:', defaultSettings);

// Set default settings on installation
chrome.runtime.onInstalled.addListener(() => {
    const log = logger('onInstalled');
    log('Extension installed. Setting default values.');
    chrome.storage.sync.get(defaultSettings, (settings) => {
        log('Existing settings found:', settings);
        chrome.storage.sync.set(settings);
        log('Settings have been set.');
    });
});