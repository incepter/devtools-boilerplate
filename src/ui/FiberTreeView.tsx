import * as React from "react";
import {ParsedNode, ParsingReturn} from "../parser/_types";
import "./style.css";
import {getVariantClassName} from "../parser/utils";

export function FiberTreeViewWithRoots({ initialIndex = 0, results }) {
  const [current, setResult] = React.useState(results[initialIndex]);

  return (
    <div className="with-roots-container">
      <div>
        {results.map((result, id) => (
          <button
            key={id}
            onClick={() => setResult(result)}
            className={result === current ? "current-root" : ""}
          >
            {`id=${result.id}`}
          </button>
        ))}
      </div>
      {current && <NodeView node={current.tree} />}
    </div>
  );
}
type FiberRootTreeViewProps = {
  result: ParsingReturn;
};

export type NodeViewProps = {
  node: ParsedNode;
  variant?: "root" | "child" | "sibling";
};

function NodeView({ node, variant = "root" }: NodeViewProps) {
  if (!node) {
    return null;
  }

  const { child, sibling, tag, props, type } = node;

  const variantClx = getVariantClassName(variant);
  const isHostThing = tag.startsWith("Host") && tag !== "HostRoot";

  const hasChild = !!child;
  const hasSibling = !!sibling;

  const separatorWidth = hasSibling ? 258 * (sibling.offset || 0) + 40 : 40;

  const containerClx = `${variantClx} ${hasSibling ? "el-has-sibling" : ""}`;
  const mainClx = `${hasChild ? "el-has-child" : ""} ${
    hasSibling ? "el-has-sibling" : ""
  }`;

  return (
    <div className={containerClx}>
      <div className={mainClx}>
        <div className={`el ${isHostThing ? "el-host" : ""}`}>
          <span>
            {tag}
            {type && <span>{` (${type.toString()})`}</span>}
          </span>

          {props &&
            Object.entries(props).map(([prop, value]) => (
              <li key={prop}>
                {prop}: {debugIt(value)}
              </li>
            ))}
        </div>
        {hasChild && <NodeView variant="child" node={child} />}
      </div>
      {hasSibling && (
        <>
          <div
            style={{ width: separatorWidth }}
            className="el-sibling-separator"
          ></div>
          <NodeView variant="sibling" node={sibling} />
        </>
      )}
    </div>
  );
}

function debugIt(src: any) {
  try {
    return String(src);
  } catch (e) {
    console.warn("This errorred");
    console.log(src);
    return src;
  }
}
