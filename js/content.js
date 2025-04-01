function createHoverIcon(target) {
  if (target.querySelector(".firegpt-hover-icon")) return;

  const icon = document.createElement("div");
  icon.textContent = "💡";
  icon.className = "firegpt-hover-icon";
  icon.style.position = "absolute";
  icon.style.top = "4px";
  icon.style.right = "4px";
  icon.style.cursor = "pointer";
  icon.style.fontSize = "14px";
  icon.style.zIndex = "9999";
  icon.title = "Click to explain this code with FireGPT";
  
  const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (darkMode) {
    icon.style.backgroundColor = "rgba(30, 30, 30, 0.9)";
    icon.style.border = "1px solid #555";
  } else {
    icon.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    icon.style.border = "1px solid #ccc";
  }

  icon.style.borderRadius = "4px";
  icon.style.padding = "2px 5px";
  icon.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";

  icon.addEventListener("click", (event) => {
    event.stopPropagation();
    event.preventDefault();
    const code = target.innerText || target.textContent || "";
    const encoded = encodeURIComponent(`Explain what this code does:\n\n${code}`);
    window.open(`https://chatgpt.com/?q=${encoded}`, "_blank");
  });

  target.style.position = "relative";
  target.appendChild(icon);
}

document.querySelectorAll("pre, code").forEach(code => {
  code.addEventListener("mouseenter", () => createHoverIcon(code));
});