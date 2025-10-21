(() => {
  const PUSHBULLET_API_KEY = "YOUR_ACCESS_TOKEN"; 
  const PUSHBULLET_URL = "https://api.pushbullet.com/v2/pushes";

  const sendPush = (title, body) => {
    fetch(PUSHBULLET_URL, {
      method: "POST",
      headers: {
        "Access-Token": PUSHBULLET_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "note",
        title,
        body
      })
    }).catch(err => console.error("Pushbullet error:", err));
  };

  // Notification API hook (works when tab inactive)
  const OriginalNotification = window.Notification;
  window.Notification = function(title, options) {
    sendPush(
      "Chrome Notification Triggered",
      `Site: ${location.hostname}\nTitle: ${title}\nMessage: ${options?.body || "No body"}`
    );
    return new OriginalNotification(title, options);
  };
  Object.assign(window.Notification, OriginalNotification);

  // DOM monitor (works when tab active)
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.innerText?.includes("sent a message")) {
            sendPush(
              "Teams Activity Detected",
              `Message detected while tab active on ${location.hostname}`
            );
            console.log("Teams message DOM change detected:", node);
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log("Notification and DOM monitor activated for", location.hostname);
})();
