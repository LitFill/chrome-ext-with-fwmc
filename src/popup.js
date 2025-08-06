import { getSettings, setSettings } from './settings.js';

document.addEventListener('DOMContentLoaded', () => {
    const extensionEnabledCheckbox = document.getElementById('extensionEnabled');
    const extremeBauBauCheckbox    = document.getElementById('extremeBauBau');

    getSettings((settings) => {
        extensionEnabledCheckbox.checked = settings.extensionEnabled;
        extremeBauBauCheckbox.checked    = settings.extremeBauBau;
    });

    extensionEnabledCheckbox.addEventListener('change', (event) => {
        setSettings({ extensionEnabled: event.target.checked });
    });

    extremeBauBauCheckbox.addEventListener('change', (event) => {
        setSettings({ extremeBauBau: event.target.checked });
    });
});
