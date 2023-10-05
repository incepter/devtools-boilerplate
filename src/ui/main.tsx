import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { __DEV__ } from "../shared";
import DevApp from "./DevApp";

let devtoolsHostContainer = document.getElementById("root") as HTMLElement;
let devtoolsRoot = ReactDOM.createRoot(devtoolsHostContainer);

if (__DEV__) {
  const container = document.createElement("div");
  const separator = document.createElement("hr");
  container.id = "root_" + String(Date.now());
  const body = document.body;
  body.insertBefore(separator, devtoolsHostContainer);
  body.insertBefore(container, devtoolsHostContainer);

  const devAppRoot = ReactDOM.createRoot(container);
  devAppRoot.render(
    <React.StrictMode>
      <DevApp />
      <hr />
    </React.StrictMode>
  );

  devtoolsRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

} else {
  devtoolsRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
