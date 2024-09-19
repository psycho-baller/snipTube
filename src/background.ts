import "webextension-polyfill-global";

browser.runtime.onInstalled.addListener((details) => {
	// take the user to the demo page after installation in production
	if (process.env.NODE_ENV === "production" && details.reason === "install") {
		browser.tabs.create({ url: "https://sniptube.vercel.app#demo" });
	}
	// browser.contextMenus.create({
	//   id: "youtube",
	//   title: "Add to Snip",
	//   contexts: ["link"],
	// });
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete" && tab.active) {
		const tabs = await browser.tabs.query({
			active: true,
			currentWindow: true,
		});
		const activeTab = tabs[0];
		if (activeTab.url?.includes("youtube.com/watch")) {
			const queryParameters = activeTab.url.split("?")[1];
			const urlParameters = new URLSearchParams(queryParameters);
			const vidId = urlParameters.get("v");

			sendMessageToContentScript(tabId, {
				type: "NEW",
				vidId,
			});
		}
	}
});

/**
 * This listener is triggered when the user is switching between tabs.
 */
browser.tabs.onActivated.addListener(async (activeInfo) => {
	// Retrieve information about the newly activated tab
	const activeTab = await browser.tabs.get(activeInfo.tabId);

	// Your existing code for checking the URL and sending messages
	if (activeTab.url?.includes("youtube.com/watch")) {
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
// browser.runtime.onInstalled.addListener(async () => {
//   //   //this introduces another unseen error: https://stackoverflow.com/questions/53939205/how-to-avoid-extension-context-invalidated-errors-when-messaging-after-an-exte

// });

browser.runtime.connect().onDisconnect.addListener(async () => {
	// clean up when content script gets disconnected
	console.log("content script disconnected");
	for (const cs of browser.runtime.getManifest().content_scripts) {
		for (const tab of await browser.tabs.query({ url: cs.matches })) {
			browser.scripting
				.executeScript({
					target: { tabId: tab.id },
					files: cs.js,
				})
				.then(() => {
					console.log("content script injected");
				})
				.catch((err) => {
					console.log("error injecting content script", err);
				});
		}
	}
});

const maxRetryAttempts = 3;

async function sendMessageToContentScript(
	tabId: number,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	message: any,
	retryCount = 0,
) {
	try {
		browser.tabs.sendMessage(tabId, message).then((response) => {
			console.log("response", response);
		});
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
export {};
