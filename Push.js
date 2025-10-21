javascript:(()=>{const k="YOUR_TOKEN";const u="https://api.pushbullet.com/v2/pushes";const O=Notification;Notification=function(t,o){fetch(u,{method:"POST",headers:{"Access-Token":k,"Content-Type":"application/json"},body:JSON.stringify({type:"note",title:"Chrome Notification Triggered",body:`Site:${location.hostname}\nTitle:${t}\nMessage:${o?.body||'No body'}`})});return new O(t,o)};Object.assign(Notification,O);alert("Notification monitor active for "+location.hostname)})();


(() => {
  const PUSHBULLET_API_KEY = "YOUR_ACCESS_TOKEN";
  const PUSHBULLET_URL = "https://api.pushbullet.com/v2/pushes";

  const OriginalNotification = window.Notification;

  window.Notification = function(title, options) {
    try {
      console.log("Notification detected:", title, options);

      fetch(PUSHBULLET_URL, {
        method: "POST",
        headers: {
          "Access-Token": PUSHBULLET_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "note",
          title: "Chrome Notification Triggered",
          body: `Site: ${location.hostname}\n📰 Title: ${title}\n💬 Message: ${options?.body || "No body"}`
        })
      }).catch(err => console.error("Pushbullet error:", err));
    } catch (e) {
      console.error("Pushbullet failed:", e);
    }

    // show original notification
    return new OriginalNotification(title, options);
  };

  // preserve static properties
  Object.assign(window.Notification, OriginalNotification);

  console.log("Notification monitor activated for", location.hostname);
})();
