let lastCodeSnippet = "";
let useTemporaryChat = false;

function buildChatGPTUrl(query, ref = "FireGPT") {
  const base = `https://chatgpt.com/?q=${query}`;
  const params = [`hints=search`];
  if (useTemporaryChat) params.push("temporary-chat=true");
  if (ref) params.push(`ref=${ref}`);
  return `${base}&${params.join("&")}`;
}

chrome.storage.sync.get("useTemporaryChat", (data) => {
  if (typeof data.useTemporaryChat === "boolean") {
    useTemporaryChat = data.useTemporaryChat;
  }
});

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
    const url = buildChatGPTUrl(query);
    chrome.tabs.create({ url });
  }

  if (info.menuItemId === "firegpt-explain-code" && lastCodeSnippet) {
    const code = encodeURIComponent(`Explain what this code does:\n\n${lastCodeSnippet}`);
    const url = buildChatGPTUrl(code, null);
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
  const url = buildChatGPTUrl(query);

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
