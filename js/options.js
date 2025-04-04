document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("temporaryChatToggle");
  
    chrome.storage.sync.get("useTemporaryChat", (data) => {
      checkbox.checked = data.useTemporaryChat || false;
    });
  
    checkbox.addEventListener("change", () => {
      chrome.storage.sync.set({ useTemporaryChat: checkbox.checked });
    });
  });