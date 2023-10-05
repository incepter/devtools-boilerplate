import * as React from "react";
import "./App.css";
import "./index.css";
import { __DEV__, DEVTOOLS_AGENT, DEVTOOLS_PANEL, getTabId } from "../shared";
import { DevtoolsMessage } from "../cs/consume";
import { devtoolsPortInDev } from "./shim";
import { ParsingReturn } from "../parser/_types";
import { FiberTreeViewWithRoots } from "./FiberTreeView";

function getNewPort(): chrome.runtime.Port {
  if (__DEV__) {
    return devtoolsPortInDev();
  }
  return chrome.runtime.connect({ name: "panel" });
}

interface PageMessageBase {
  tabId: number;
  source: string;
}

export type PageMessage = {
  type: "scan-result";
  data: ParsingReturn[];
  source: typeof DEVTOOLS_AGENT;
};

export enum DevtoolsMessageType {
  init = "init",
  scan = "scan",
}

function App() {
  let [port, setPort] = React.useState<chrome.runtime.Port | null>(getNewPort);

  let [result, setResult] = React.useState<ParsingReturn[] | null>(null);

  React.useEffect(() => {
    if (!port) {
      let newPort = getNewPort();
      setPort(newPort);
      return;
    }
    let disconnected = false;

    port.postMessage({
      source: DEVTOOLS_PANEL,
      type: DevtoolsMessageType.init,
      tabId: getTabId(),
    });

    port.onMessage.addListener(onMessageFromPage);
    port.onDisconnect.addListener(() =>
      port!.onMessage.removeListener(onMessageFromPage)
    );
    port.onDisconnect.addListener(onPortDisconnect);

    return onPortDisconnect;

    function onMessageFromPage(message: PageMessage) {
      if (disconnected) {
        return;
      }
      if (!__DEV__) {
        if (message.source !== DEVTOOLS_AGENT) {
          return;
        }
      }

      switch (message.type) {
        case "scan-result": {
          console.log("received result", message.data);
          let data = message.data;
          setResult(data);
        }
      }
    }

    function onPortDisconnect() {
      if (disconnected) {
        return;
      }
      port!.onMessage.removeListener(onMessageFromPage);
      disconnected = true;
      setPort(null);
    }
  }, [port]);

  console.log("render", result);

  return (
    <div className="App">
      {port && (
        <div className="header">
          <button
            onClick={() =>
              port!.postMessage({
                source: __DEV__ ? DEVTOOLS_PANEL : DEVTOOLS_PANEL,
                type: DevtoolsMessageType.scan,
                tabId: getTabId(),
              } as DevtoolsMessage)
            }
          >
            Refresh
          </button>
        </div>
      )}
      {result && <FiberTreeViewWithRoots results={result} />}
    </div>
  );
}

export default App;
