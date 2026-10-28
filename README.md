# Liquid Dialer

Frosted-glass calling UI (recents, contacts, dialer, in-call controls) packaged as an Android app with a WebView wrapper.

- Tap the call button: the number opens in your phone's real dialer.
- Settings, contacts and call log are saved on the device.
- The "Build APK" GitHub Action builds the APK on every push and publishes it as a GitHub Release: download it from the Releases page.
- `styles.css.b64` and `js-ui.js.b64` are the two large web assets, base64-packed; the workflow decodes them before building.
