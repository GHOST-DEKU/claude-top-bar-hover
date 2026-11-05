// Background script. It does three small jobs:
// 1. runs the keyboard shortcut (tells the active tab to show or hide the bar),
// 2. puts the peek countdown on the toolbar icon (the page sends it),
// 3. puts "off" on the icon while the extension is switched off.

const api = typeof browser !== "undefined" ? browser : chrome;
const GREY = "#6b7280";
const GREEN = "#1f7a4d";

async function paintGlobal() {
  const { on } = await api.storage.local.get({ on: true });
  api.action.setBadgeBackgroundColor({ color: GREY });
  api.action.setBadgeText({ text: on ? "" : "off" });
}
paintGlobal();
api.runtime.onInstalled.addListener(paintGlobal);
api.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.on) paintGlobal();
});

api.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || msg.type !== "badge" || !sender.tab) return;
  const tabId = sender.tab.id;
  (async () => {
    // When the countdown ends, fall back to what the whole extension shows ("off" or nothing).
    let text = msg.text;
    if (!text) text = (await api.storage.local.get({ on: true })).on ? "" : "off";
    api.action.setBadgeBackgroundColor({ tabId, color: text === "off" ? GREY : GREEN });
    api.action.setBadgeText({ tabId, text });
  })();
});

api.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-bar") return;
  const [tab] = await api.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  try {
    await api.tabs.sendMessage(tab.id, { type: "toggle" });
  } catch (_) {
    // Not a claude.ai tab: nothing to do.
  }
});
