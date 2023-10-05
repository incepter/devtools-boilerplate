import { parseNode } from "./parse.js";
import { DEVTOOLS_AGENT, DEVTOOLS_PANEL } from "../shared";

if (!window.__REACT_FIBER_TREE__) {
  window.__REACT_FIBER_TREE__ = {
    scanAndSend,
  };

  (window as any).addEventListener("message", onMessageFromContentScript);
}

export function scanAndSend() {
  let reactSharedGlobals = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!reactSharedGlobals) {
    console.log("no react devtools");
    return;
  }
  // assuming 1 is for react-dom, gotta verify
  let availableRoots = reactSharedGlobals.getFiberRoots?.(1);
  if (!availableRoots) {
    console.log("no available roots");
    return;
  }

  let roots = [...availableRoots];
  if (!roots.length) {
    console.log("roots size is zero");
    return;
  }

  console.log("proceeding to parse the root");

  let results = roots.map((root) => {
    let hostNode = root.containerInfo;
    let result = parseNode(root.current);
    return {
      ...result,
      id: hostNode.id,
    };
  });

  (window as any).postMessage(
    {
      type: "scan-result",
      source: DEVTOOLS_AGENT,
      data: results,
    },
    "*"
  );
}

export function onMessageFromContentScript(message) {
  console.log("GOT A MESSAGE", message?.data?.source);
  if (!message || !message.data || message.data.source !== DEVTOOLS_PANEL) {
    return;
  }

  if (message.type === "scan") {
    window.__REACT_FIBER_TREE__.scanAndSend();
  }
}
