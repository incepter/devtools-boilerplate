import React from "react";

export type ParsedNode = {
  tag: string;
  type: string;
  props:
    | string
    | { props: string | number | symbol }
    | { children: string | number | symbol }
    | Record<string, string>
    | undefined;

  child?: ParsedNode;
  sibling?: ParsedNode;

  offset?: number;
};

export type ParsingReturn = {
  id?: string,
  tree: ParsedNode,
  count: number,
}

export interface ReactFiberRoot {
  current: ReactFiber;
  _current: ReactFiber;
  __listeners: {
    id: number;
    list: Record<number, React.Dispatch<React.SetStateAction<number>>>;
  };
  containerInfo: HTMLDivElement;
}

export interface ReactFiber extends ReactFiberRoot {
  tag: number;
  type: unknown;
  memoizedProps: any;
  stateNode: ReactFiberRoot;

  child: ReactFiber | null;
  sibling: ReactFiber | null;
}
