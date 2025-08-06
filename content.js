// Store settings in a variable
let settings = {
    extensionEnabled: true,
    extremeBauBau:    false,
};

// Function to remove all existing overlays
function removeAllOverlays() {
    document
    .querySelectorAll('.overlay-image')
    .forEach(overlay => overlay.remove());
}

// Main function to add or remove overlays based on settings
function updateOverlays() {
    // If the extension is disabled, remove all overlays and do nothing
    if (!settings.extensionEnabled) {
        removeAllOverlays();
        return;
    }

    const baseSelectors = [
        // general video
        'ytd-thumbnail a > yt-image > img.yt-core-image',
        // short video
        'ytm-shorts-lockup-view-model > a > div.shortsLockupViewModelHostThumbnailContainer',
        // general video
        'yt-thumbnail-view-model > div.yt-thumbnail-view-model__image',
    ];

    const extremeSelector =
        'div#container > div.html5-video-player > div.html5-video-container';

    const selectors =
        settings.extremeBauBau
        ? [...baseSelectors, extremeSelector]
        : baseSelectors;

    selectors.forEach(selector => {
        const thumbnailImages = document.querySelectorAll(selector);
        thumbnailImages.forEach(thumbnailImg => {
            const container =
                thumbnailImg.closest('ytd-thumbnail')
                || thumbnailImg.parentElement;

            if (!container || container.querySelector('.overlay-image'))
                return;

            try {
                const overlayImg = document.createElement('img');
                overlayImg.src   = chrome.runtime.getURL('with-fwmc.png');

                const computedStyle = window.getComputedStyle(container);
                if (computedStyle.position === 'static')
                    container.style.position = 'relative';

                overlayImg.style.position  = 'absolute';
                overlayImg.style.bottom    = '0';
                overlayImg.style.right     = '0';
                overlayImg.style.maxWidth  = '55%';
                overlayImg.style.maxHeight = '41%';
                overlayImg.style.zIndex    = '10';
                overlayImg.classList.add('overlay-image');

                container.appendChild(overlayImg);
            } catch (error) {
                // Context invalidated, probably because the element was removed from the page
                // No need to log this as an error, it's an expected behavior in a dynamic page

                // WARN: if this is not needed, how about removing it?
            }
        });
    });
}

// Load initial settings from storage
chrome.storage.sync.get(['extensionEnabled', 'extremeBauBau'], (result) => {
    settings.extensionEnabled = typeof result.extensionEnabled === 'undefined' ? true : result.extensionEnabled;
    settings.extremeBauBau    = result.extremeBauBau === true;
    updateOverlays();
});

// Listen for changes in settings
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'sync') return;

    let changed = false;
    if (typeof changes.extensionEnabled !== 'undefined') {
        settings.extensionEnabled = changes.extensionEnabled.newValue;
        changed = true;
    }
    if (typeof changes.extremeBauBau !== 'undefined') {
        settings.extremeBauBau = changes.extremeBauBau.newValue;
        changed = true;
    }
    if (changed) updateOverlays();
});

// Use MutationObserver to detect dynamically loaded content
const observer = new MutationObserver(updateOverlays);
observer.observe(document.body, {
    childList: true,
    subtree:   true,
});

// Initial run
updateOverlays();
