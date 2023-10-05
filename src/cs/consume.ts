import { Settings } from "../shared";

interface DevtoolsMessageBase {
  tabId: number;
  source: string;
}

interface DevtoolsInitMessage extends DevtoolsMessageBase {
  payload: null;
  type: DevtoolsMessageType.init;
}

interface DevtoolsScanAndSendMessagePayload {}

interface DevtoolsScanAndSendMessage extends DevtoolsMessageBase {
  payload: Settings;
  type: DevtoolsMessageType.scan;
}

export type DevtoolsMessage = DevtoolsInitMessage | DevtoolsScanAndSendMessage;

export enum DevtoolsMessageType {
  init = "init",
  scan = "scan",
}

export function consumeMessage(message: DevtoolsMessage) {
  console.log("consuming message", message, window.__REACT_FIBER_TREE__);

  switch (message.type) {
    case DevtoolsMessageType.init:
      console.log("devtools init message", message);
      return;
    case DevtoolsMessageType.scan:
      console.log("devtools scan message", message);
      return;
  }
}
