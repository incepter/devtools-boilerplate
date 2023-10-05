import { DEVTOOLS_PANEL } from "../shared";
import { DevtoolsMessageType } from "../cs/consume";

chrome.runtime.onMessage.addListener(onMessageFromContentScript); // content-script -> background (here) -> devtools
chrome.runtime.onConnect.addListener(onDevtoolsConnect);

let ports = {};

function onMessageFromContentScript(message, sender) {
  const port =
    sender.tab && sender.tab.id !== undefined && ports[sender.tab.id];
  if (port) {
    port.postMessage(message);
  }
  return true;
}

function onDevtoolsConnect(port) {
  port.onMessage.addListener(onMessageFromDevtools); // devtools -> background (here) -> content-script
  port.onDisconnect.addListener(onDevtoolsDisconnect);

  let tabId;

  function onMessageFromDevtools(message) {
    if (message.source !== DEVTOOLS_PANEL) {
      return;
    }
    console.log("bg received", message);
    if (message.type === DevtoolsMessageType.init) {
      if (tabId && ports[tabId]) {
        onDevtoolsDisconnect();
      }
      tabId = message.tabId;
      ports[tabId] = port;
      chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        chrome.scripting.executeScript({
          target: {
            tabId: tab!.id!,
          },
          files: ["bgScript.js"],
          // @ts-ignore
          world: chrome.scripting.ExecutionWorld.MAIN,
        });
      });
      chrome.tabs.sendMessage(tabId, message);
      return;
    }
    if (!tabId) {
      return;
    }
    if (ports[tabId]) {
      chrome.tabs.sendMessage(tabId, message);
    }
  }

  function onDevtoolsDisconnect() {
    delete ports[tabId];
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, {
      source: DEVTOOLS_PANEL,
      type: DevtoolsMessageType.init,
    });
  }
});

declare global {
  interface Window {
    __REACT_FIBER_TREE__: {
      scanAndSend(): void;
    };
    __REACT_DEVTOOLS_GLOBAL_HOOK__: {
      getFiberRoots(id: number): Set<any>;
    };
  }
}
