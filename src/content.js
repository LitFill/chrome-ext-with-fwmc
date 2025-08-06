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

const SELECTORS = [
    'ytd-thumbnail a > yt-image > img.yt-core-image',
    'ytm-shorts-lockup-view-model > a > div.shortsLockupViewModelHostThumbnailContainer',
    'yt-thumbnail-view-model > div.yt-thumbnail-view-model__image',
];

const EXTREME_SELECTOR = 'div#container > div.html5-video-player > div.html5-video-container';

let currentSettings = {};

function addOverlay(element) {
    const container = element.closest('ytd-thumbnail') || element.parentElement;
    if (!container || container.querySelector('.overlay-image')) {
        return;
    }

    container.classList.add('overlay-container');
    const overlayImg = document.createElement('img');
    overlayImg.src = chrome.runtime.getURL('with-fwmc.png');
    overlayImg.classList.add('overlay-image');
    container.appendChild(overlayImg);
}

function removeAllOverlays() {
    document.querySelectorAll('.overlay-image').forEach(overlay => overlay.remove());
    document.querySelectorAll('.overlay-container').forEach(container => container.classList.remove('overlay-container'));
}

function getSelectors(settings) {
    return settings.extremeBauBau ? [...SELECTORS, EXTREME_SELECTOR] : SELECTORS;
}

function processNode(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
    }

    const selectors = getSelectors(currentSettings);
    selectors.forEach(selector => {
        if (node.matches(selector)) {
            addOverlay(node);
        }
        node.querySelectorAll(selector).forEach(addOverlay);
    });
}

function handleMutations(mutations) {
    if (!currentSettings.extensionEnabled) {
        return;
    }

    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(processNode);
        }
    }
}

function applyInitialOverlays() {
    if (!currentSettings.extensionEnabled) {
        return;
    }
    const selectors = getSelectors(currentSettings);
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(addOverlay);
    });
}

function onSettingsChanged(settings) {
    const wasEnabled = currentSettings.extensionEnabled;
    currentSettings = settings;

    if (!settings.extensionEnabled) {
        removeAllOverlays();
    } else if (!wasEnabled && settings.extensionEnabled) {
        applyInitialOverlays();
    }
}

// Initialisation
getSettings(settings => {
    currentSettings = settings;
    applyInitialOverlays();

    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        getSettings(onSettingsChanged);
    }
});
