import { getSettings, setSettings } from './settings.js';

const DEBUG = true;
const logger = (location) => (...args) => {
    if (DEBUG) {
        console.log(`[FWMC Popup] ${location}:`, ...args);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const log = logger('DOMContentLoaded');
    log('Popup opened.');

    const extensionEnabledCheckbox = document.getElementById('extensionEnabled');
    const extremeBauBauCheckbox    = document.getElementById('extremeBauBau');

    log('Fetching initial settings.');
    getSettings((settings) => {
        log('Settings loaded:', settings);
        extensionEnabledCheckbox.checked = settings.extensionEnabled;
        extremeBauBauCheckbox.checked    = settings.extremeBauBau;
    });

    extensionEnabledCheckbox.addEventListener('change', (event) => {
        const enabled = event.target.checked;
        log(`Extension enabled toggled to: ${enabled}`);
        setSettings({ extensionEnabled: enabled });
    });

    extremeBauBauCheckbox.addEventListener('change', (event) => {
        const extreme = event.target.checked;
        log(`Extreme mode toggled to: ${extreme}`);
        setSettings({ extremeBauBau: extreme });
    });
});