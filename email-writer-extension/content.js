console.log("Email Writer Extension - Content Script Loaded");

// Creates and returns the AI reply button element
function createAIButton() {
  const button = document.createElement("div");
  button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  button.style.marginRight = "8px";
  button.innerText = "AI Replay";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI Reply");
  return button;
}

// Finds the Gmail compose toolbar from known selectors
function findComposeToolbar() {
  const selectors = [".btC", ".aDh", '[role="toolbar"]', ".gU.Up"];

  for (let s of selectors) {
    const toolbar = document.querySelector(s);
    if (toolbar) return toolbar;
  }
  return null;
}

// Extracts the email content from Gmail's DOM
function getEmailContent() {
  const selectors = [
    ".h7",
    ".a3s.aiL",
    ".gmail_quote",
    '[role="presentation"]',
  ];

  for (let s of selectors) {
    const content = document.querySelector(s);
    if (content) return content.innerText.trim();
  }
  return "";
}

// Injects the AI reply button and handles its click behavior
function injectButton() {
  const existingButton = document.querySelector(".ai-reply-button");
  if (existingButton) existingButton.remove();

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }

  const button = createAIButton();
  button.classList.add("ai-reply-button");

  // Sends email content to backend and inserts the AI-generated reply
  button.addEventListener("click", async (e) => {
    try {
      button.innerHTML = "Generating...";
      button.disabled = true;

      const emailContent = getEmailContent();

      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailContent,
          tone: "professional",
        }),
      });

      if (!response.ok) {
        throw new Error("API Request Failed");
      }

      const generatedReply = await response.text();

      const composeBox = document.querySelector(
        '[role="textbox"][g_editable="true"]'
      );

      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedReply);
      } else {
        console.error("Compose Box was not found");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to generate the reply");
    } finally {
      button.innerHTML = "AI Reply";
      button.disabled = false;
    }
  });

  toolbar.insertBefore(button, toolbar.firstChild);
}

// Observes DOM mutations to detect Gmail compose windows
const observer = new MutationObserver((mutations) => {
  mutations.forEach((m) => {
    const addedNodes = Array.from(m.addedNodes);
    const hasComposeElements = addedNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh, .btC, [role="dialog"]') ||
          node.querySelector('.aDh, .btC, [role="dialog"]'))
    );

    if (hasComposeElements) {
      console.log("Compose Window Detected");
      setTimeout(injectButton, 500);
    }
  });
});

// Start observing the page for compose window changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
