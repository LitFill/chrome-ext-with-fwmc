# Changelog

## Version 1.3.0

This update transitions the extension from a static, hardcoded script to a
dynamic, user-configurable tool. The primary focus was to improve the user
experience by adding a settings popup, which removes the need for users to
manually edit code to change settings.

### Key Enhancements:

1.  **Added a Settings Popup Menu:**
    *   **Files Added:** `popup.html`, `popup.js`, `popup.css`.
    *   **Reasoning:** To provide a user-friendly interface for managing the
        extension's features. Users can now enable/disable the extension and
        toggle "Extreme Bau Bau Mode" directly from the popup without touching
        the source code. This makes the extension significantly more accessible
        and easier to use.

2.  **Introduced User Settings with `chrome.storage`:**
    *   **Files Modified:** `popup.js`, `content.js`, `manifest.json`.
    *   **Reasoning:** To persist user preferences across browser sessions. The
        state of the toggles in the popup is now saved, ensuring that the
        user's choices are remembered. This was a necessary step to make the
        popup functional.

3.  **Created a Background Script:**
    *   **Files Added:** `background.js`.
    *   **Reasoning:** To set default values for the settings
        (`extensionEnabled: true`, `extremeBauBau: false`) when the extension
        is first installed. This ensures a consistent and predictable initial
        state for all users.

4.  **Refactored `content.js` for Dynamic Control:**
    *   **Files Modified:** `content.js`.
    *   **Reasoning:** The script was rewritten to be modular and settings-aware.
        *   It now fetches its configuration from `chrome.storage`.
        *   It listens for real-time changes to the settings (via
            `chrome.storage.onChanged`) and dynamically adds or removes the
            overlays on the page without requiring a refresh.
        *   The logic for selecting DOM elements is now conditional based on
            whether "Extreme Bau Bau Mode" is active.

5.  **Updated `manifest.json`:**
    *   **Files Modified:** `manifest.json`.
    *   **Reasoning:**
        *   Registered the new `popup.html` under the `action` key.
        *   Registered the `background.js` service worker.
        *   Replaced the unused `activeTab` permission with the `storage`
            permission, adhering to the principle of least privilege.
        *   Incremented the version number to `1.3.0` to reflect the
            significant new features.
