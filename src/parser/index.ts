import { parseNode } from "./parse.js";
import { DEVTOOLS_AGENT, DEVTOOLS_PANEL } from "../shared";

console.log("bg load");
if (!window.__REACT_FIBER_TREE__) {
  window.__REACT_FIBER_TREE__ = {
    scanAndSend() {
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
        let result = parseNode(root.current);
        let hostNode = root.containerInfo;
        return {
          ...result,
          id: hostNode.id,
        };
      });

      console.log("result is", results);

      (window as any).postMessage(
        {
          type: "scan-result",
          source: DEVTOOLS_AGENT,
          data: results,
        },
        "*"
      );
    },
  };

  (window as any).addEventListener("message", onMessageFromContentScript);
}

function stringify(val, depth) {
  depth = isNaN(+depth) ? 1 : depth;

  function _build(key, val, depth, o?, a?) {
    // (JSON.stringify() has it's own rules, which we respect here by using it for property iteration)
    return !val || typeof val !== "object"
      ? val
      : ((a = Array.isArray(val)),
        JSON.stringify(val, function (k, v) {
          if (a || depth > 0) {
            if (!k) return (a = Array.isArray(v)), (val = v);
            !o && (o = a ? [] : {});
            o[k] = _build(k, v, a ? depth : depth - 1);
          }
        }),
        o || (a ? [] : {}));
  }

  return JSON.stringify(_build("", val, depth));
}

function onMessageFromContentScript(message) {
  console.log("GOT A MESSAGE", message?.data?.source);
  if (!message || !message.data || message.data.source !== DEVTOOLS_PANEL) {
    return;
  }

  let api = window.__REACT_FIBER_TREE__;

  api.scanAndSend();
  console.log("valid message");
}
