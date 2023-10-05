import { scanAndSend } from "./parse.js";
import { DEVTOOLS_PANEL } from "../shared";

if (!window.__REACT_FIBER_TREE__) {
  window.__REACT_FIBER_TREE__ = {
    scanAndSend,
  };

  (window as any).addEventListener("message", onMessageFromContentScript);
}

function onMessageFromContentScript(message) {
  console.log("GOT A MESSAGE", message?.data?.source);
  if (!message || !message.data || message.data.source !== DEVTOOLS_PANEL) {
    return;
  }

  if (message.data.type === "scan") {
    window.__REACT_FIBER_TREE__.scanAndSend();
  }
}
