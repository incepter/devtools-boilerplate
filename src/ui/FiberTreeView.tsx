import * as React from "react";
import { ParsedNode, ParsingReturn } from "../parser/_types";
import "./style.css";
import { getVariantClassName, humanizeTag } from "../parser/utils";

type FiberRootTreeViewProps = {
  initialIndex?: number;
  results: ParsingReturn[];
};

export function FiberTreeViewWithRoots({
  initialIndex = 0,
  results,
}: FiberRootTreeViewProps) {
  const [currentIndex, setCurrentIndex] = React.useState<number>(initialIndex);
  const current = results[currentIndex];

  console.log("papapa", current);

  return (
    <div className="with-roots-container">
      <div>
        {results.map((result: ParsingReturn, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`root-btn ${
              result[1] === current[1] ? "current-root" : ""
            }`}
          >
            <span>{`id=${result[1]}`}</span>
            <span>{`${result[0]} total nodes`}</span>
          </button>
        ))}
      </div>
      {current && <NodeView node={current[2]} />}
    </div>
  );
}

export type NodeViewProps = {
  node: ParsedNode;
  variant?: "root" | "child" | "sibling";
};

function NodeView({ node, variant = "root" }: NodeViewProps) {
  if (!node) {
    return null;
  }

  const [numberTag, type, props, offset, child, sibling] = node;
  const tag = humanizeTag(numberTag);

  const variantClx = getVariantClassName(variant);
  const isHostThing = tag.startsWith("Host") && tag !== "HostRoot";

  const hasChild = !!child;
  const hasSibling = !!sibling;

  const separatorWidth = hasSibling ? 172 * (sibling[3] || 0) + 20 : 20;

  const containerClx = `${variantClx} ${hasSibling ? "el-has-sibling" : ""}`;
  const mainClx = `${hasChild ? "el-has-child" : ""} ${
    hasSibling ? "el-has-sibling" : ""
  }`;

  let elementTitle = `${String(type)}\n(${tag})`;

  return (
    <div className={containerClx}>
      <div className={mainClx}>
        <div className={`el ${isHostThing ? "el-host" : ""}`}>
          <span title={elementTitle}>
            {type && type !== "null" && (
              <span className="el-type">{String(type)}</span>
            )}
            <span className="el-tag">{tag}</span>
          </span>
          <div className="el-props">
            {props &&
              Object.entries(props).map(([prop, value]) => (
                <li
                  title={`${prop}: ${safeString(value)}`}
                  key={prop}
                >{`${prop}: ${safeString(value).substring(0, 20)}`}</li>
              ))}
          </div>
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

function safeString(src: any) {
  try {
    return String(src);
  } catch (e) {
    console.warn("This errorred");
    console.log(src);
    return "--parsing-error";
  }
}
