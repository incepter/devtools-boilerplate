import {DEVTOOLS_AGENT, DEVTOOLS_PANEL} from "../shared";
import {consumeMessage, DevtoolsMessage, performWork} from "./consume";

(window as any).chrome.runtime.onMessage.addListener(onMessageFromBackground); // background -> content-script (here) -> page
(window as any).addEventListener('message', onMessageFromPage); // page -> content-script (here) -> background

function onMessageFromBackground(message) {
  if (message.source !== DEVTOOLS_PANEL) {
    return;
  }
  consumeMessage(message as DevtoolsMessage);
  // (window as any).postMessage(message, '*');
}

function onMessageFromPage(event) { // page -> content-script (here) -> background
  if (
    event.source === window &&
    event.data &&
    event.data.source === DEVTOOLS_AGENT
  ) {
    (window as any).chrome.runtime.sendMessage(event.data);
  }
}



window.addEventListener('load', performWork);
