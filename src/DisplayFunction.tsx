import React from "react";
import { generateSOP } from "./utils/generateSOP";
import { generatePOS } from "./utils/generatePOS";
import "./css/displayfunction.css";

interface DisplayFunctionProps {
  outputValues: string[];
  numVariables: number;
}

const DisplayFunction: React.FC<DisplayFunctionProps> = ({ outputValues, numVariables }) => {
  const sop = generateSOP(outputValues, numVariables);
  const pos = generatePOS(outputValues, numVariables);

  return (
    <div className="df-container">
      <h3 className="df-title">Generated Functions</h3>
      <div className="df-function">
        <span className="df-label">SOP:</span> <span className="df-value">{sop || "—"}</span>
      </div>
      <div className="df-function">
        <span className="df-label">POS:</span> <span className="df-value">{pos || "—"}</span>
      </div>
    </div>
  );
};

export default DisplayFunction;
