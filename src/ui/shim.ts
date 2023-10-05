import { __DEV__, DEVTOOLS_AGENT, DEVTOOLS_PANEL } from "../shared";
import { DevtoolsMessage, DevtoolsMessageType } from "../cs/consume";
import {scanAndSend} from "../parser";

let shimId = 0;

export function devtoolsPortInDev(): chrome.runtime.Port {
  let onDisconnect: Function[] = [];
  let listeners: Function[] | null = [];
  let listener = spyOnMessagesFromCurrentPage.bind(null, () => listeners);

  (window as any).addEventListener("message", listener);
  return {
    listeners,
    id: ++shimId,
    postMessage(msg) {
      window.postMessage(msg);
    },
    // @ts-ignore
    onMessage: {
      addListener(fn) {
        listeners?.push(fn);
      },
      removeListener(fn) {
        if (!listeners) {
          return;
        }
        listeners = listeners.filter((t) => t !== fn);
      },
    },
    // @ts-ignore
    onDisconnect: {
      addListener(fn) {
        onDisconnect.push(fn);
        (window as any).addEventListener("message", listener);
      },
      removeListener(fn) {
        if (!onDisconnect) {
          return;
        }
        onDisconnect = onDisconnect.filter((t) => t !== fn);
      },
    },
  };
}

function spyOnMessagesFromCurrentPage(listeners, message) {
  if (message.data?.source === DEVTOOLS_AGENT) {
    let toNotify = listeners();
    toNotify?.forEach?.((fn) => fn(message.data));
  }
  if (__DEV__) {
    if (message.data?.source === DEVTOOLS_PANEL) {
      consumeMessage(message.data);
    }
  }
}

export function consumeMessage(message: DevtoolsMessage) {
  console.log("consuming message_______", message);

  scanAndSend();
}
