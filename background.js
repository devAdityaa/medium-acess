let id = 1;
let ids = [];

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "myContextMenuOption",
    title: "Break this Article!",
    contexts: ["all"],
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!(tab.url.includes("webcache.googleusercontent"))) {
    let rules = await chrome.declarativeNetRequest.getDynamicRules();
    let rulesArr = rules.map((rule) => rule.id);

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rulesArr,
    });
  }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "myContextMenuOption" && !(tab.url.includes("webcache.googleusercontent.com"))) {
    let url = "http://webcache.googleusercontent.com/search?q=cache:" + tab.url;
    chrome.tabs.update({ url: url });

    id = id + Math.floor(Math.random() * 1000);
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: id,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter:
              "https://cdn-client.medium.com/lite/static/js/main*",
          },
        },
      ],
    });

    ids.push(id);
  }
});
