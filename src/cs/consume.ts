import {
  AgentEventType,
  DEVTOOLS_AGENT,
  getSettings, log,
  Settings,
  storageKey
} from "../shared";

interface DevtoolsMessageBase {
  tabId: number,
  source: string,
  reload?: boolean,
}

interface DevtoolsInitMessage extends DevtoolsMessageBase {
  payload: null,
  type: DevtoolsMessageType.init,
}


interface DevtoolsSaveSettingsMessage extends DevtoolsMessageBase {
  payload: Settings,
  type: DevtoolsMessageType.saveSettings,
}

export type DevtoolsMessage = DevtoolsInitMessage | DevtoolsSaveSettingsMessage;

export enum DevtoolsMessageType {
  init = "init",
  saveSettings = "saveSettings",
}


export let pendingTimeout: ReturnType<typeof setTimeout> | null = null;

export function consumeMessage(message: DevtoolsMessage) {
  switch (message.type) {
    case DevtoolsMessageType.init:
      let currentSettings = getSettings();
      (window as any).postMessage({
        source: DEVTOOLS_AGENT,
        payload: currentSettings,
        type: AgentEventType.settingsChange,
      }, "*");
      log(currentSettings, 'received init message!');
      return;
    case DevtoolsMessageType.saveSettings:
      let {payload} = message;
      log(payload, "settings changed", message.payload);

      if (pendingTimeout && !payload.enabled) {
        log(payload, "clearing current timeout", pendingTimeout);
        clearTimeout(pendingTimeout);
        pendingTimeout = null;
      }

      localStorage.setItem(storageKey, JSON.stringify(payload));
      (window as any).postMessage({
        payload,
        source: DEVTOOLS_AGENT,
        type: AgentEventType.settingsChange,
      }, "*");

      if (!pendingTimeout && payload.enabled && !message.reload) {
        log(payload, "start working after enable");
        performWork();
      }

      if (message.reload) {
        location.reload();
      }
      return;
  }
}

export function performWork() {
  let settings = getSettings();
  log(settings, "window loaded with settings", settings);

  if (!settings.enabled) {
    log(settings, "not enabled, doing nothing");
    return;
  }
  log(settings, "extension is enabled");

  log(settings, "this page is targeted with these selectors", settings.selectors);

  function getCandidate() {
    for (let selector of settings.selectors) {
      let candidate = document.querySelector(selector);
      if (candidate) {
        log(settings, "found a candidate", candidate);
        return candidate;
      }
    }
    log(settings, "did not find any candidate for all selectors", settings.selectors);
  }

  function work() {
    let firstCandidate = getCandidate();
    if (firstCandidate) {
      log(settings, "clicking on candidate", firstCandidate);
      (firstCandidate as HTMLInputElement).click();
    } else {
      log(settings, "scheduling refresh in", settings.refreshDelayMs);
      pendingTimeout = setTimeout(() => {
        log(settings, "refreshing page");
        location.reload();
      }, settings.refreshDelayMs);
    }
  }

  work();
}
