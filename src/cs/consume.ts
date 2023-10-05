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
