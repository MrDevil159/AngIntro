/* Buzzer-on-notification installer
   Paste into console. Exposes:
     - stopBuzzer()
     - startBuzzer()
     - setBuzzerOptions({freq, volume, type})
*/
(function installBuzzer() {
  if (window.__notificationBuzzerInstalled) {
    console.info('Notification buzzer already installed.');
    return;
  }
  window.__notificationBuzzerInstalled = true;

  // Audio setup
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  let osc = null, gain = null;
  let buzzerRunning = false;
  let buzzerSources = new Map(); // sourceId => reason
  let defaultOptions = { freq: 440, volume: 0.2, type: 'square' }; // buzzer feel

  function createAndStartOscillator(opts = {}) {
    const { freq, volume, type } = Object.assign({}, defaultOptions, opts);
    if (!audioCtx) return;
    if (buzzerRunning) return;
    try {
      // browsers often require a user gesture to resume AudioContext
      if (audioCtx.state === 'suspended') {
        const resumed = audioCtx.resume();
        // resume returns a promise; we continue regardless.
        resumed.catch(() => {
          console.warn('AudioContext resume blocked; click the page to allow audio.');
        });
      }
      osc = audioCtx.createOscillator();
      gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = volume;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      buzzerRunning = true;
      console.info('Buzzer started (freq:', freq, 'type:', type, 'vol:', volume, ')');
    } catch (e) {
      console.error('Failed to start oscillator:', e);
    }
  }

  function stopOscillator() {
    if (!buzzerRunning) return;
    try {
      if (osc) {
        try { osc.stop(); } catch(e) {}
        try { osc.disconnect(); } catch(e) {}
      }
      if (gain) {
        try { gain.disconnect(); } catch(e) {}
      }
    } finally {
      osc = null; gain = null; buzzerRunning = false;
      console.info('Buzzer stopped.');
    }
  }

  // Public controls
  window.startBuzzer = function(reasonId, opts) {
    if (reasonId) buzzerSources.set(reasonId, opts || true);
    createAndStartOscillator(opts);
  };
  window.stopBuzzer = function(reasonId) {
    if (reasonId) {
      buzzerSources.delete(reasonId);
      if (buzzerSources.size === 0) stopOscillator();
      return;
    }
    buzzerSources.clear();
    stopOscillator();
  };
  window.setBuzzerOptions = function(o) {
    defaultOptions = Object.assign({}, defaultOptions, o || {});
    if (buzzerRunning) {
      // restart with new options
      const curSources = Array.from(buzzerSources.keys());
      stopOscillator();
      createAndStartOscillator(defaultOptions);
      // re-add existing source ids
      curSources.forEach(k => buzzerSources.set(k, true));
    }
  };

  // 1) Hook Notification API
  (function hookNotification() {
    try {
      const NativeNotification = window.Notification;
      if (!NativeNotification) return;
      function WrappedNotification(title, options) {
        // create the real notification
        const n = new NativeNotification(title, options);
        try {
          const id = 'notif-api-' + Math.random().toString(36).slice(2,9);
          // start buzzer for this notification
          window.startBuzzer(id, { freq: 520, volume: 0.15, type: 'square' });

          // stop buzzer when notification closes
          n.addEventListener && n.addEventListener('close', () => {
            window.stopBuzzer(id);
          });
          // Some browsers don't emit 'close' reliably; monitor 'onclick' or add a timeout fallback
          n.addEventListener && n.addEventListener('click', () => {
            // user interacted -> stop buzzer for this notification
            window.stopBuzzer(id);
          });
          // Fallback: stop after 30s if still present (some notifications auto-close)
          setTimeout(() => { window.stopBuzzer(id); }, 30000);
        } catch (e) {
          console.warn('Notification buzzer wrapper error', e);
        }
        return n;
      }
      WrappedNotification.requestPermission = function(...args) {
        return NativeNotification.requestPermission(...args);
      };
      Object.defineProperty(WrappedNotification, 'permission', {
        get() { return NativeNotification.permission; }
      });
      // copy prototype so instanceof still often works
      WrappedNotification.prototype = NativeNotification.prototype;
      window.Notification = WrappedNotification;
      console.info('Notification API hooked: buzzer will sound when site creates new Notification().');
    } catch (e) {
      console.warn('Could not hook Notification API:', e);
    }
  })();

  // 2) MutationObserver for in-page notifications (toasts/alerts)
  (function domNotificationObserver() {
    function looksLikeNotification(node) {
      if (!node || node.nodeType !== 1) return false;
      try {
        const role = node.getAttribute && node.getAttribute('role');
        if (role && role.toLowerCase().includes('alert')) return true;
        const live = node.getAttribute && node.getAttribute('aria-live');
        if (live && live.toLowerCase() !== 'off') return true;
        const cls = (node.className || '').toString().toLowerCase();
        const id = (node.id || '').toString().toLowerCase();
        if (/notif|notification|toast|alert|toaster|snackbar/.test(cls + ' ' + id)) return true;
        // small visible elements with text sometimes are notifications
        const visible = node.offsetParent !== null || (node.getBoundingClientRect && (node.getBoundingClientRect().width > 0 || node.getBoundingClientRect().height > 0));
        if (visible && (cls.split(/\s+/).length <= 3) && node.textContent && node.textContent.trim().length < 600 && /!|failed|error|success|sent|new/i.test(node.textContent)) {
          return true;
        }
      } catch(e){/* ignore */ }
      return false;
    }

    function handleAddedNode(node) {
      if (looksLikeNotification(node)) {
        const id = 'dom-notif-' + Math.random().toString(36).slice(2,9);
        window.startBuzzer(id, { freq: 440, volume: 0.18, type: 'square' });
        // watch until removed from DOM
        const removalObserver = new MutationObserver(() => {
          if (!document.body.contains(node)) {
            window.stopBuzzer(id);
            removalObserver.disconnect();
          }
        });
        removalObserver.observe(document.body, { childList: true, subtree: true });
        // also auto-stop after 30s as safety
        setTimeout(() => window.stopBuzzer(id), 30000);
      } else {
        // check children recursively
        if (node.querySelectorAll) {
          const kids = node.querySelectorAll('[role],[aria-live],[class],[id]');
          for (let i = 0; i < Math.min(kids.length, 50); i++) {
            if (looksLikeNotification(kids[i])) {
              handleAddedNode(kids[i]);
            }
          }
        }
      }
    }

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          try { handleAddedNode(n); } catch(e){}
        }
      }
    });
    mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
    console.info('DOM notification observer active: will watch for toast/alert nodes.');
  })();

  // 3) Optional: listen for custom events named "notification" or similar
  (function customEventListener() {
    ['notification','notify','toast','toastshow'].forEach(evtName => {
      window.addEventListener(evtName, (ev) => {
        const id = 'custom-event-' + evtName + '-' + Math.random().toString(36).slice(2,9);
        window.startBuzzer(id, { freq: 480, volume: 0.16, type: 'square' });
        // stop after a reasonable time
        setTimeout(() => window.stopBuzzer(id), 25000);
      }, true);
    });
    console.info('Listening for common custom notification events (notification, toast, notify).');
  })();

  // helpful usage hint
  console.log('Buzzer helper installed. Controls: stopBuzzer(), startBuzzer(reasonId), setBuzzerOptions({freq,volume,type}).\nIf you see "AudioContext resume blocked" message, click the page once to allow audio.');
})();
