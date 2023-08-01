// chrome.runtime.onInstalled.addListener(() => {
// predefine the snip store
// setSnips([]);

// chrome.contextMenus.create({
//   id: "youtube",
//   title: "Add to Snip",
//   contexts: ["link"],
// });
// });
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// console.log("background running", "3");
// // if (changeInfo.status === "complete") {
// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//   const tab = tabs[0];
//   console.log("background running", "4");
//   if (tab.url && tab.url.includes("youtube.com/watch")) {
//     console.log("background running", "5");

//     // console.log("tabId", tabId);
//     const queryParameters = tab.url.split("?")[1];
//     const urlParameters = new URLSearchParams(queryParameters);
//     const vidId = urlParameters.get("v");
//     console.log("vidId", vidId);

//     chrome.tabs.sendMessage(tab.id, {
//       // new
//       type: "NEW",
//       vidId,
//     });
//     // returning
//     // chrome.tabs.sendMessage(tabId, { // returning
//   }
// });

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.url && details.url.includes("youtube.com/watch")) {
    const queryParameters = details.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const vidId = urlParameters.get("v");
    console.log("vidId", vidId);

    chrome.tabs.sendMessage(details.tabId, {
      // new
      type: "NEW",
      vidId,
    });
  }
});
