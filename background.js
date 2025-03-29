chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "firegpt-search",
      title: "Search with FireGPT",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "firegpt-search" && info.selectionText) {
      const query = encodeURIComponent(info.selectionText);
      const url = `https://chatgpt.com/?q=${query}&hints=search&ref=ext`;
      chrome.tabs.create({ url });
    }
  });