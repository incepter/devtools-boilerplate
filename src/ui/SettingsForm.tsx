import {
  __DEV__,
  DEVTOOLS_AGENT,
  DEVTOOLS_PANEL,
  getTabId,
  Settings
} from "../shared";
import {DevtoolsMessage} from "../cs/consume";
import * as React from "react";
import {DevtoolsMessageType} from "./App";

function SettingsForm({port, settings}: { settings: Settings, port: any }) {
  return (
    <div className="settings-form">
      <div>enabled: <input id="enabled" placeholder="enabled"
                           defaultChecked={settings.enabled}
                           type="checkbox"/><br/></div>
      <div>logEnabled: <input id="logEnabled" placeholder="logEnabled"
                              defaultChecked={settings.logEnabled}
                              type="checkbox"/><br/></div>
      <div>refreshDelayMs:<br /> <input id="refreshDelayMs"
                                  placeholder="refreshDelayMs"
                                  defaultValue={settings.refreshDelayMs}
                                  type="text"/><br/></div>
      <div>selectors:<br/>
        <textarea rows={5} cols={50} id="selectors" placeholder="selectors"
                                defaultValue={settings.selectors.join(',')}/><br/>
      </div>

      <div className="edit-settings-actions">
        <button onClick={() => port.postMessage(
          {
            source: __DEV__ ? DEVTOOLS_AGENT : DEVTOOLS_PANEL,
            payload: getSettingsFromDom(),
            type: DevtoolsMessageType.saveSettings,
            tabId: getTabId()
          } as DevtoolsMessage
        )}>
          Save
        </button>
        <button onClick={() => port.postMessage(
          {
            reload: true,
            source: __DEV__ ? DEVTOOLS_AGENT : DEVTOOLS_PANEL,
            payload: getSettingsFromDom(),
            type: DevtoolsMessageType.saveSettings,
            tabId: getTabId()
          } as DevtoolsMessage
        )}>
          Save And reload
        </button>
      </div>
    </div>
  );
}

function getSettingsFromDom(): Settings {
  return {
    selectors: (document.getElementById("selectors") as HTMLInputElement)!.value.split(","),
    refreshDelayMs: +(document.getElementById("refreshDelayMs") as HTMLInputElement)!.value,
    logEnabled: (document.getElementById("logEnabled") as HTMLInputElement)!.checked,
    enabled: (document.getElementById("enabled") as HTMLInputElement)!.checked,
  };
}

export default SettingsForm;
