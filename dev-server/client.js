class HotModule {
  /** @type {string} */
  url;
  acceptCb;

  constructor(_url) {
    this.url = _url;
  }

  accept(cb) {
    // console.log(`Registering hot update for ${this.url}`);
    this.acceptCb = cb;
  }

  async handleAccept() {
    if (!this.acceptCb) {
      return;
    }
    // 1. get new module
    const mod = await import(`${this.url}?t=${Date.now()}`);
    this.acceptCb(mod);
  }
}

/** @type {Map<string, HotModule>} */
window.hotModules ??= new Map();

/** @type {WebSocket} */
window.ws ??= new WebSocket("ws://localhost:8080");

function connectWs(mod) {
  window.ws.addEventListener("message", (payload) => {
    const data = JSON.parse(payload.data);
    console.log(data);
    if (data.type === "file:changed") {
      if (data.file === mod.file) {
        const mod = window.hotModules.get(data.file);
        mod.handleAccept();
      }
    }
  });
}

function hmrClient(mod) {
  const urlObj = new URL(mod.url);
  const url = urlObj.pathname;
  const hotMod = new HotModule(url);
  window.hotModules.set(url, hotMod);

  import.meta.hot = hotMod;

  // console.log(`[HMR Client]: ${url}`);
  connectWs(mod);
}
