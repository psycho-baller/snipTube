// chrome.runtime.onInstalled.addListener(() => {
// predefine the snip store
// setSnips([]);

// chrome.contextMenus.create({
//   id: "youtube",
//   title: "Add to Snip",
//   contexts: ["link"],
// });
// });
// declare global {
//   interface Window {
//     // browser: typeof chrome;
//     msBrowser: typeof chrome;
//   }
// }

// window.browser = window.browser || window.chrome;

// const browser = window.browser;

// import { browser } from "webextension-polyfill-ts";

// if process.env.NODE_ENV === "development" {

const web = (process.env.PLASMO_BROWSER === "firefox" ? browser : chrome) as typeof chrome;
console.log("browser", browser);
web.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log("tabId", tabId);
  if (changeInfo.status === "complete" && tab.active) {
    const tabs = await web.tabs.query({ active: true, currentWindow: true });
    console.log("tabs", tabs);
    const activeTab = tabs[0];
    if (activeTab.url && activeTab.url.includes("youtube.com/watch")) {
      const queryParameters = activeTab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const vidId = urlParameters.get("v");
      console.log("vidId", vidId);

      web.tabs.sendMessage(activeTab.id, {
        // new
        type: "NEW",
        vidId,
      });
      // returning
      // chrome.tabs.sendMessage(tabId, { // returning
    }
  }
});

// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   if (details.url && details.url.includes("youtube.com/watch")) {
//     const queryParameters = details.url.split("?")[1];
//     const urlParameters = new URLSearchParams(queryParameters);
//     const vidId = urlParameters.get("v");
//     console.log("vidId", vidId);

//     chrome.tabs.sendMessage(details.tabId, {
//       // new
//       type: "NEW",
//       vidId,
//     });
//   }
// });

// https://stackoverflow.com/questions/10994324/chrome-extension-content-script-re-injection-after-upgrade-or-install
// another possible solution: https://stackoverflow.com/a/76126272
// browser.runtime.onInstalled.addListener(async () => {
//   //this introduces another unseen error: https://stackoverflow.com/questions/53939205/how-to-avoid-extension-context-invalidated-errors-when-messaging-after-an-exte

//   for (const cs of browser.runtime.getManifest().content_scripts) {
//     for (const tab of await browser.tabs.query({ url: cs.matches })) {
//       const data = browser.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: cs.js,
//       });
//       console.log("injected", data);
//     }
//   }
// });

export {};
