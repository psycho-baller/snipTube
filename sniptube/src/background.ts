import { setSnips } from "~utils/storage";

chrome.runtime.onInstalled.addListener(() => {
  // predefine the snip store
  setSnips([]);

  // chrome.contextMenus.create({
  //   id: "youtube",
  //   title: "Add to Snip",
  //   contexts: ["link"],
  // });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      if (tab.url && tab.url.includes("youtube.com/watch")) {
        // console.log("tabId", tabId);
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        const vidId = urlParameters.get("v");

        chrome.tabs.sendMessage(tabId, { // new
          type: "NEW",
          vidId
        });
        // returning
        // chrome.tabs.sendMessage(tabId, { // returning

      }
    }
  });
});
