import * as React from "react";
import './App.css'
import {
  __DEV__,
  AgentEventType,
  DEVTOOLS_AGENT,
  DEVTOOLS_PANEL,
  getTabId,
  libDisplayName,
  Settings
} from "../shared";
import {DevtoolsMessage} from "../cs/consume";
import {devtoolsPortInDev} from "./shim";
import SettingsForm from "./SettingsForm";

function getNewPort(): chrome.runtime.Port {
  if (__DEV__) {
    return devtoolsPortInDev();
  }
  return chrome.runtime.connect({name: "panel"});
}

interface PageMessageBase {
  tabId: number,
  source: string,
}

interface PageSettingsChangeMessage extends PageMessageBase {
  payload: Settings,
  type: AgentEventType.settingsChange,
}


export type PageMessage = PageSettingsChangeMessage;

export enum DevtoolsMessageType {
  init = "init",
  saveSettings = "saveSettings",
}

function App() {
  let [port, setPort] = React.useState<chrome.runtime.Port | null>(getNewPort);
  let [settings, setSettings] = React.useState<Settings | null>(null);

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
      tabId: getTabId()
    });

    port.onMessage.addListener(onMessageFromPage);
    port.onDisconnect.addListener(() => port!.onMessage.removeListener(onMessageFromPage));
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
        case AgentEventType.settingsChange:
          setSettings(message.payload);
          return;
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
  return (
    <div className="App">
      {settings && (
        <span
          className={settings.enabled ? "info-enabled" : "info-disabled"}>
          {libDisplayName} is {settings.enabled ? "Enabled" : "Disabled"}
        </span>
      )}
      {(port && settings) && (
        <div className="header">
          <button
            onClick={() => port!.postMessage(
              {
                source: __DEV__ ? DEVTOOLS_PANEL : DEVTOOLS_PANEL,
                type: DevtoolsMessageType.saveSettings,
                tabId: getTabId(),
                payload: {
                  ...settings,
                  enabled: !settings!.enabled,
                }
              } as DevtoolsMessage
            )}>
            {settings.enabled ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={() => port!.postMessage(
              {
                reload: true,
                source: DEVTOOLS_PANEL,
                type: DevtoolsMessageType.saveSettings,
                tabId: getTabId(),
                payload: {
                  ...settings,
                  enabled: !settings!.enabled,
                }
              } as DevtoolsMessage
            )}>
            {settings.enabled ? 'Disable And reload page' : 'Enable And reload page'}
          </button>
        </div>
      )}
      <details className="edit-settings">
        <summary>Edit settings</summary>
        {settings !== null ? (
          <SettingsForm key={JSON.stringify(settings)} port={port}
                        settings={settings}/>
        ) : null}
      </details>
    </div>
  )
}

export default App
