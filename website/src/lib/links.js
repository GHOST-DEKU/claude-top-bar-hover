export const REPO = 'https://github.com/GHOST-DEKU/claude-top-bar-hover';
export const FIREFOX = 'https://addons.mozilla.org/en-US/firefox/addon/claude-top-bar-on-hover/';
// Always the newest release: GitHub redirects "latest/download" to the newest non-draft, non-pre-release.
export const CHROME_ZIP = `${REPO}/releases/latest/download/claude-top-bar-hover-chrome.zip`;
// The version always follows the extension's manifest, so the site never shows an old number.
import manifest from '../../../manifest.json';
export const VERSION = manifest.version;
