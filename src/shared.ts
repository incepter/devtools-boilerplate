export let __DEV__ = process.env.NODE_ENV !== "production";

let libName = process.env.EXTENSION_LIB_NAME || "my-lib";
if (__DEV__) {
  libName = `dev-mode-${libName}`;
}
export let libDisplayName = process.env.EXTENSION_LIB_DISPLAY_NAME || "My lib";
export let DEVTOOLS_PANEL = `${libName}-panel` as const;
export let DEVTOOLS_AGENT = `${libName}-agent` as const;

export let storageKey =
  process.env.EXTENSION_LIB_DISPLAY_NAME || "my_lib_storage";

export type Settings = {
  enabled: boolean;
  selectors: string[];
  logEnabled: boolean;
  refreshDelayMs: number;
};

export enum AgentEventType {
  settingsChange = "settingsChange",
}

export function log(settings: Settings, ...args) {
  if (settings.logEnabled) {
    console.log(`[[ ${libDisplayName} ]] -`, ...args);
  }
}

export function getTabId() {
  if (__DEV__) {
    return -1;
  }
  return chrome.devtools.inspectedWindow?.tabId;
}
