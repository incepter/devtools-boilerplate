import { ParsedNode, ReactFiber } from "./_types";

export function getNodeType(node: ReactFiber) {
  return typeof node.type === "function" ? node.type.name : String(node.type);
}

export function humanizeTag(tag: number) {
  switch (tag) {
    case 0: {
      return "FunctionComponent";
    }
    case 1: {
      return "ClassComponent";
    }
    case 2: {
      return "IndeterminateComponent";
    }
    case 3: {
      return "HostRoot";
    }
    case 4: {
      return "HostPortal";
    }
    case 5: {
      return "HostComponent";
    }
    case 6: {
      return "HostText";
    }
    case 7: {
      return "Fragment";
    }
    case 8: {
      return "Mode";
    }
    case 9: {
      return "ContextConsumer";
    }
    case 10: {
      return "ContextProvider";
    }
    case 11: {
      return "ForwardRef";
    }
    case 12: {
      return "Profiler";
    }
    case 13: {
      return "SuspenseComponent";
    }
    case 14: {
      return "MemoComponent";
    }
    case 15: {
      return "SimpleMemoComponent";
    }
    case 16: {
      return "LazyComponent";
    }
    case 17: {
      return "IncompleteClassComponent";
    }
    case 18: {
      return "DehydratedFragment";
    }
    case 19: {
      return "SuspenseListComponent";
    }
    case 21: {
      return "ScopeComponent";
    }
    case 22: {
      return "OffscreenComponent";
    }
    case 23: {
      return "LegacyHiddenComponent";
    }
    case 24: {
      return "CacheComponent";
    }
    case 25: {
      return "TracingMarkerComponent";
    }
    case 26: {
      return "HostHoistable";
    }
    case 27: {
      return "HostSingleton";
    }
    default: {
      throw new Error("not supported tag" + String(tag));
    }
  }
}

function StringValue(str) {
  try {
    return String(str);
  } catch (e) {
    return "parse-error";
  }
}

export function getNodeProps(node: ReactFiber) {
  let props: ParsedNode[2] = undefined;

  if (node.memoizedProps !== null) {
    const memoizedProps = node.memoizedProps;

    if (typeof memoizedProps === "object" && memoizedProps !== null) {
      const { children, ...otherProps } = node.memoizedProps;

      if (typeof children === "string" || typeof children === "number") {
        props = { children };
      } else {
        const propsKeys = Object.keys(otherProps);
        if (propsKeys.length > 0) {
          props = {};

          for (const prop of propsKeys) {
            if (typeof memoizedProps[prop] === "function") {
              props[prop] = memoizedProps[prop].name;
            } else {
              props[prop] = StringValue(memoizedProps[prop]);
            }
          }
        }
      }
    }
    if (
      typeof memoizedProps === "string" ||
      typeof memoizedProps === "number"
    ) {
      props = { props: memoizedProps };
    }
  }
  return props;
}

export function getVariantClassName(variant: "root" | "child" | "sibling") {
  return variant === "child"
    ? "el-child"
    : variant === "sibling"
    ? "el-sibling"
    : "el-root";
}
