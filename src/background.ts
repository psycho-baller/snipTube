// chrome.runtime.onInstalled.addListener(() => {
// predefine the snip store
// setSnips([]);

// chrome.contextMenus.create({
//   id: "youtube",
//   title: "Add to Snip",
//   contexts: ["link"],
// });
// });
export {};
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log("background running", "3");
  if (changeInfo.status === "complete" && tab.active) {
    console.log("background running", "4");
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    console.log("background running", "5");
    console.log("activeTab", activeTab);
    if (activeTab.url && activeTab.url.includes("youtube.com/watch")) {
      console.log("background running", "6");

      console.log("tabId", tabId);
      const queryParameters = activeTab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const vidId = urlParameters.get("v");
      console.log("vidId", vidId);

      chrome.tabs.sendMessage(activeTab.id, {
        type: "NEW",
        vidId,
      });
      // returning
      // chrome.tabs.sendMessage(tabId, { // returning
    }
  }
});

/**
 * This listener is triggered when the user is switching between tabs.
 */
chrome.tabs.onActivated.addListener(async (activeInfo) => {

  // Retrieve information about the newly activated tab
  const activeTab = await chrome.tabs.get(activeInfo.tabId);

  // Your existing code for checking the URL and sending messages
  if (activeTab.url && activeTab.url.includes("youtube.com/watch")) {
    console.log("background running onActivated", activeTab.url);

    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const vidId = urlParameters.get("v");
    console.log("vidId", vidId);
    sendMessageToContentScript(activeTab.id, {
      type: "UPDATE_VIDEO_ID",
      vidId,
    });
  }
});

// chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
//   console.log("webNavigation running", details);
//   if (details.url && details.url.includes("youtube.com/watch")) {
//     console.log("webNavigation running", "youtube tab activated");
//     const queryParameters = details.url.split("?")[1];
//     const urlParameters = new URLSearchParams(queryParameters);
//     const vidId = urlParameters.get("v");
//     console.log("vidId", vidId);

//     chrome.tabs.sendMessage(details.tabId, {
//       type: "NEW",
//       vidId,
//     });
//   }
// });

// https://stackoverflow.com/questions/10994324/chrome-extension-content-script-re-injection-after-upgrade-or-install
// another possible solution: https://stackoverflow.com/a/76126272
// chrome.runtime.onInstalled.addListener(async () => {
//   //this introduces another unseen error: https://stackoverflow.com/questions/53939205/how-to-avoid-extension-context-invalidated-errors-when-messaging-after-an-exte

//   for (const cs of chrome.runtime.getManifest().content_scripts) {
//     for (const tab of await chrome.tabs.query({ url: cs.matches })) {
//       chrome.scripting.executeScript(
//         {
//           target: { tabId: tab.id },
//           files: cs.js,
//         },
//         (data) => {
//           console.log("injected", data);
//         }
//       );
//     }
//   }
// });

const maxRetryAttempts = 3;

async function sendMessageToContentScript(tabId, message, retryCount = 0) {
  try {
    await chrome.tabs.sendMessage(tabId, message);
  } catch (error) {
    if (retryCount < maxRetryAttempts) {
      setTimeout(() => {
        sendMessageToContentScript(tabId, message, retryCount + 1);
      }, 1000); // Retry after 1 second
    } else {
      console.error("Failed to send message after multiple attempts", error);
    }
  }
}
