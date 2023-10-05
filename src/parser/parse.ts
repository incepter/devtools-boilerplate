import { ParsedNode, ParsingReturn, ReactFiber } from "./_types";
import { getNodeProps, getNodeType, humanizeTag } from "./utils";
import React from "react";

let visitedFibersCount = 0;
let currentChildrenSiblingsOffset = 0;
function internal_ParseNode(node: ReactFiber): ParsedNode {
  visitedFibersCount += 1;
  const type = getNodeType(node);
  const props = getNodeProps(node);
  const tag = humanizeTag(node.tag);

  const result: ParsedNode = {
    tag,
    type,
    props,
  };

  if (node.child && node.sibling) {
    const previousOffset = currentChildrenSiblingsOffset;
    currentChildrenSiblingsOffset = 0;

    result.child = internal_ParseNode(node.child);
    const resultingOffset = currentChildrenSiblingsOffset;

    result.sibling = internal_ParseNode(node.sibling);
    result.sibling.offset = resultingOffset;
    currentChildrenSiblingsOffset += previousOffset + 1;
  } else {
    if (node.child) {
      result.child = internal_ParseNode(node.child);
    }
    if (node.sibling) {
      currentChildrenSiblingsOffset += 1;
      result.sibling = internal_ParseNode(node.sibling);
    }
  }
  return result;
}

export function parseNode(node: ReactFiber): ParsingReturn {
  visitedFibersCount = 0;
  currentChildrenSiblingsOffset = 0;

  const result = internal_ParseNode(node);
  const nodesCount = visitedFibersCount;

  visitedFibersCount = 0;
  currentChildrenSiblingsOffset = 0;

  return {
    tree: result,
    count: nodesCount,
  };
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
