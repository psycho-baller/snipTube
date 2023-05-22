// chrome.runtime.onInstalled.addListener(() => {
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      // console.log("tabId", tabId);
      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      chrome.tabs.sendMessage(tabId, { // new
        type: "NEW",
        videoId: urlParameters.get("v"),
      });
      // returning
      // chrome.tabs.sendMessage(tabId, { // returning

    }
  }
});
// });
