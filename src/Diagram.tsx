import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { generateSOPMermaid, generatePOSMermaid } from "./utils/generateMermaid";
import "./css/diagram.css";


interface DiagramProps {
  expression: string;      // SOP or POS string
  type: "SOP" | "POS";
}

const Diagram: React.FC<DiagramProps> = ({ expression, type }) => {
  const container = useRef<HTMLDivElement>(null);

  const mermaidCode = type === "SOP" 
    ? generateSOPMermaid(expression) 
    : generatePOSMermaid(expression);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    if (container.current) {
      container.current.innerHTML = "";
      const div = document.createElement("div");
      div.className = "mermaid";
      div.innerHTML = mermaidCode;
      container.current.appendChild(div);
      mermaid.init(undefined, div);
    }
  }, [mermaidCode]);

  return (
    <div className="diagram-container">
      {/* <h3 className="diagram-title">{type} Logic Diagram</h3> */}
      <div ref={container}></div>
    </div>
  );
};

export default Diagram;
