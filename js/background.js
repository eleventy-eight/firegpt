let lastCodeSnippet = "";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "firegpt-search",
    title: "Search with FireGPT",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "firegpt-explain-code",
    title: "Explain code with FireGPT",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "firegpt-search" && info.selectionText) {
    const query = encodeURIComponent(info.selectionText);
    const url = `https://chatgpt.com/?q=${query}&hints=search&ref=ext`;
    chrome.tabs.create({ url });
  }

  if (info.menuItemId === "firegpt-explain-code" && lastCodeSnippet) {
    const code = encodeURIComponent(`Explain what this code does:\n\n${lastCodeSnippet}`);
    const url = `https://chatgpt.com/?q=${code}`;
    chrome.tabs.create({ url });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "storeCodeSnippet") {
    lastCodeSnippet = message.code;
  }
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  const query = encodeURIComponent(text);
  const url = `https://chatgpt.com/?q=${query}&hints=search&ref=ext`;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    chrome.tabs.create({ url }, () => {
      // Close the omnibox-activated blank tab
      if (currentTab && currentTab.url === "about:blank") {
        chrome.tabs.remove(currentTab.id);
      }
    });
  });
});
