import * as React from "react";

export default function DevApp() {
  return (
    <div>
      <span>Hi ! {Date.now()}</span>
      <Inner initialText={"Hello World !"} />
      <div>
        <p>OK</p>
        <span>Haaa !!</span>
        <p>OK::</p>
      </div>
    </div>
  );
}

function Inner({ initialText }) {
  let [state, setState] = React.useState(initialText);

  return <input value={state} onChange={(e) => setState(e.target.value)} />;
}
