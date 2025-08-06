// --- Inlined from settings.js ---
const defaultSettings = {
    extensionEnabled: true,
    extremeBauBau:    false,
};

function getSettings(callback) {
    chrome.storage.sync.get(defaultSettings, (settings) => {
        callback(settings);
    });
}
// --- End inlined code ---

const DEBUG = true;
const logger = (location) => (...args) => {
    if (DEBUG) {
        console.log(`[FWMC Content] ${location}:`, ...args);
    }
};

const SELECTORS = [
    'ytd-thumbnail a > yt-image > img.yt-core-image',
    'ytm-shorts-lockup-view-model > a > div.shortsLockupViewModelHostThumbnailContainer',
    'yt-thumbnail-view-model > div.yt-thumbnail-view-model__image',
];
const EXTREME_SELECTOR = 'div#container > div.html5-video-player > div.html5-video-container';

let currentSettings = {};

function addOverlay(element) {
    const log = logger('addOverlay');
    try {
        const container = element.closest('ytd-thumbnail') || element.parentElement;
        if (!container || container.querySelector('.overlay-image')) {
            return;
        }

        log('Applying overlay to element:', element);
        container.classList.add('overlay-container');
        const overlayImg = document.createElement('img');
        overlayImg.src = chrome.runtime.getURL('with-fwmc.png');
        overlayImg.classList.add('overlay-image');
        container.appendChild(overlayImg);
    } catch (error) {
        log('Error during overlay application:', error);
    }
}

function removeAllOverlays() {
    const log = logger('removeAllOverlays');
    log('Removing all overlays.');
    document.querySelectorAll('.overlay-image').forEach(overlay => overlay.remove());
    document.querySelectorAll('.overlay-container').forEach(container => container.classList.remove('overlay-container'));
}

function getSelectors(settings) {
    return settings.extremeBauBau ? [...SELECTORS, EXTREME_SELECTOR] : SELECTORS;
}

function processNode(node) {
    const log = logger('processNode');
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
    }

    const selectors = getSelectors(currentSettings);
    selectors.forEach(selector => {
        if (node.matches(selector)) {
            log('Found matching element:', node);
            addOverlay(node);
        }
        node.querySelectorAll(selector).forEach(element => {
            log('Found matching child element:', element);
            addOverlay(element);
        });
    });
}

function handleMutations(mutations) {
    const log = logger('handleMutations');
    if (!currentSettings.extensionEnabled) return;

    log(`Processing ${mutations.length} mutations.`);
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(processNode);
        }
    }
}

function applyInitialOverlays() {
    const log = logger('applyInitialOverlays');
    if (!currentSettings.extensionEnabled) {
        log('Extension is disabled, skipping initial overlays.');
        return;
    }
    log('Applying initial overlays.');
    const selectors = getSelectors(currentSettings);
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(addOverlay);
    });
}

function onSettingsChanged(settings) {
    const log = logger('onSettingsChanged');
    const wasEnabled = currentSettings.extensionEnabled;
    log('Settings changed. Old settings:', currentSettings, 'New settings:', settings);
    currentSettings = settings;

    if (!settings.extensionEnabled) {
        removeAllOverlays();
    } else if (!wasEnabled && settings.extensionEnabled) {
        log('Extension was enabled, applying initial overlays.');
        applyInitialOverlays();
    }
}

// Initialisation
const log = logger('Initialisation');
log('Script loaded. Fetching settings.');
getSettings(settings => {
    log('Initial settings loaded:', settings);
    currentSettings = settings;
    applyInitialOverlays();

    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
    log('Mutation observer started.');
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        logger('onChanged')('Storage change detected. Refetching settings.');
        getSettings(onSettingsChanged);
    }
});