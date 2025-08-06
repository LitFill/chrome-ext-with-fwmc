
// Set default settings on installation
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.storage.sync.get(['extensionEnabled', 'extremeBauBau'], (result) => {
//         const defaults = {
//             extensionEnabled: typeof result.extensionEnabled === 'undefined' ? true  : result.extensionEnabled,
//             extremeBauBau:    typeof result.extremeBauBau    === 'undefined' ? false : result.extremeBauBau,
//         };
//         chrome.storage.sync.set(defaults);
//     });
// });

/**
 * @param {boolean} setting
 * @param {boolean} def_val
 * @returns boolean
 */
const set_default = (setting, def_val) =>
    typeof setting === 'undefined' ? def_val : setting

// Set default settings on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['extensionEnabled', 'extremeBauBau'], (result) => {
        chrome.storage.sync.set({
            extensionEnabled: set_default(result.extensionEnabled, true),
            extremeBauBau:    set_default(result.extremeBauBau,    false),
        });
    });
});
