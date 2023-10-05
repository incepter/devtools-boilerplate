import React from "react";

export type ParsedNodeStructured = {
  tag: number;
  type: string;
  props: Props;
  offset: number;
  child: ParsedNode | null;
  sibling: ParsedNode | null;
};

export type ParsedNode = [
  tag: number, // 0
  type: string, // 1
  props: Props, // 2
  offset: number, // 3
  child: ParsedNode | null, // 4
  sibling: ParsedNode | null // 5
];

export type Props =
  | string
  | { props: string | number | symbol }
  | { children: string | number | symbol }
  | Record<string, string>
  | undefined;

export type ParsingReturnStructured = {
  count: number;
  id: string | null;
  tree: ParsedNode;
};

export type ParsingReturn = [
  count: number,
  id: string | null,
  tree: ParsedNode
];

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
