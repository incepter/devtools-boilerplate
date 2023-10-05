import * as React from "react";

export default function DevApp() {
  return (
    <div>
      <span>Hi ! {Date.now()}</span>
      <Inner />
    </div>
  );
}

function Inner() {
  let [state, setState] = React.useState("Hello World !");

  return <input value={state} onChange={(e) => setState(e.target.value)} />;
}
