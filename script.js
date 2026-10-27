(() => {
  const config = window.SITE_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  $("year").textContent = new Date().getFullYear();

  const nav = $("mainNav"), menuToggle = $("menuToggle");
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
  }));

  const instagramLink = $("instagramLink");
  if (config.instagramUrl && /^https:\/\/(www\.)?instagram\.com\//i.test(config.instagramUrl)) {
    instagramLink.href = config.instagramUrl;
  } else {
    instagramLink.href = "https://www.instagram.com/";
    instagramLink.addEventListener("click", (e) => {
      if (!config.instagramUrl) { e.preventDefault(); alert("Add your Instagram profile URL in config.js before publishing this link."); }
    });
  }

  const form = $("leadForm"), formStatus = $("formStatus");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (!config.enableLiveLeadForm || !config.leadWebhookUrl) {
      formStatus.textContent = "The form is currently in demo mode and did not send or save your details. Connect and test your n8n production webhook, then enable the form in config.js.";
      formStatus.classList.add("status-warning");
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    delete data.consent;
    data.source = "website";
    data.submittedAt = new Date().toISOString();
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = "Sending…";
    try {
      const response = await fetch(config.leadWebhookUrl, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      formStatus.textContent = "Thank you. Your enquiry was sent successfully.";
      formStatus.style.color = "#8df0c5"; formStatus.style.background = "#132d2b";
    } catch (_) {
      formStatus.textContent = "We couldn't send the enquiry right now. Please try again later or contact us on Instagram.";
      formStatus.style.color = "#ffd0a1";
    } finally {
      button.disabled = false; button.innerHTML = 'Send enquiry <span>↗</span>';
    }
  });

  const launcher = $("chatLauncher"), panel = $("chatPanel");
  const closeChat = () => { panel.hidden = true; launcher.setAttribute("aria-expanded", "false"); };
  launcher.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    launcher.setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) $("chatInput").focus();
  });
  $("chatClose").addEventListener("click", closeChat);
  const messages = $("chatMessages");
  function addBubble(text, who) {
    const el = document.createElement("div");
    el.className = "chat-bubble " + who;
    el.textContent = text;
    messages.appendChild(el); messages.scrollTop = messages.scrollHeight;
  }
  $("chatForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = $("chatInput"), message = input.value.trim();
    if (!message) return;
    addBubble(message, "user"); input.value = "";
    if (!config.enableLiveChat || !config.chatWebhookUrl) {
      addBubble("Thanks for your message. Live AI chat isn't connected yet. Please use the enquiry form, or message us on Instagram.", "bot");
      return;
    }
    const pending = document.createElement("div");
    pending.className = "chat-bubble bot"; pending.textContent = "Thinking…"; messages.appendChild(pending);
    try {
      const response = await fetch(config.chatWebhookUrl, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId: getSessionId(), source: "website-chat" })
      });
      if (!response.ok) throw new Error("Chat request failed");
      const result = await response.json();
      pending.remove();
      const reply = result.reply || result.output || result.response || result.text;
      addBubble(typeof reply === "string" ? reply : "We couldn't find a reply in the response. Please use the enquiry form.", "bot");
    } catch (_) {
      pending.remove();
      addBubble("We couldn't connect to the chat service right now. Please use the enquiry form or contact us on Instagram.", "bot");
    }
  });
  function getSessionId() {
    // Random identifier kept only in this page session; no third-party storage.
    if (!window.sessionStorage.getItem("paia-chat-session")) {
      window.sessionStorage.setItem("paia-chat-session", "web-" + Math.random().toString(36).slice(2) + Date.now().toString(36));
    }
    return window.sessionStorage.getItem("paia-chat-session");
  }
})();
