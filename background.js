
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


/** @type {(keys: string[], callback: (result: object) => void) => void} */
const get = chrome.storage.sync.get
/** @type {(result: object) => void} */
const set = chrome.storage.sync.set

/**
 * @param {boolean} setting
 * @param {boolean} def_val
 * @returns boolean
 */
const set_default = (setting, def_val) =>
    typeof setting === 'undefined' ? def_val : setting

// Set default settings on installation
chrome.runtime.onInstalled.addListener(() => {
    get(['extensionEnabled', 'extremeBauBau'], (result) => {
        set({
            extensionEnabled: set_default(result.extensionEnabled, true),
            extremeBauBau:    set_default(result.extremeBauBau,    false),
        });
    });
});
