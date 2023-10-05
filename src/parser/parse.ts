import { ParsedNode, ParsingReturn, ReactFiber } from "./_types";
import { getNodeProps, getNodeType, humanizeTag } from "./utils";
import React from "react";
import {DEVTOOLS_AGENT} from "../shared";

let visitedFibersCount = 0;
let currentChildrenSiblingsOffset = 0;
function internal_ParseNode(node: ReactFiber): ParsedNode {
  visitedFibersCount += 1;

  const type = getNodeType(node);
  const props = getNodeProps(node);

  let childResult: ParsedNode | null = null;
  let siblingResult: ParsedNode | null = null;

  if (node.child && node.sibling) {
    const previousOffset = currentChildrenSiblingsOffset;
    currentChildrenSiblingsOffset = 0;

    childResult = internal_ParseNode(node.child);
    const resultingOffset = currentChildrenSiblingsOffset;

    siblingResult = internal_ParseNode(node.sibling);
    siblingResult[3] = resultingOffset;

    currentChildrenSiblingsOffset += previousOffset + 1;
  } else {
    if (node.child) {
      childResult = internal_ParseNode(node.child);
    }
    if (node.sibling) {
      currentChildrenSiblingsOffset += 1;
      siblingResult = internal_ParseNode(node.sibling);
    }
  }

  return [
    node.tag,
    type,
    props,
    0, // the offset
    childResult,
    siblingResult,
  ];
}

export function parseNode(node: ReactFiber): ParsingReturn {
  visitedFibersCount = 0;
  currentChildrenSiblingsOffset = 0;

  const result = internal_ParseNode(node);
  const nodesCount = visitedFibersCount;

  visitedFibersCount = 0;
  currentChildrenSiblingsOffset = 0;

  return [
    nodesCount,
    node.stateNode.containerInfo.id || null, // the root id
    result,
  ];
}

export function setupRoot(
  root: ReactFiber,
  forceUpdate: React.Dispatch<React.SetStateAction<number>>
) {
  if (!root) {
    return;
  }
  const fiberRoot = root.stateNode;
  fiberRoot._current = root;

  if (!fiberRoot.__listeners) {
    fiberRoot.__listeners = {
      id: 0,
      list: {},
    };
  }

  fiberRoot.__listeners.id += 1;
  const thisId = fiberRoot.__listeners.id;
  fiberRoot.__listeners.list[thisId] = forceUpdate;

  Object.defineProperty(fiberRoot, "current", {
    set: function (v) {
      this._current = v;

      Object.values(fiberRoot.__listeners.list).forEach((rerender) =>
        rerender((prev) => prev + 1)
      );
    },
    get() {
      return this._current;
    },
  });
  return () => {
    delete fiberRoot.__listeners.list[thisId];
  };
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
