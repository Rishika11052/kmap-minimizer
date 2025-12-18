import { useMemo } from "react";
import Diagram from "../Diagram";
import { generateSOP } from "../utils/generateSOP";
import { generatePOS } from "../utils/generatePOS";
import { useTruthTable } from "../context/TruthTableContext";

interface ResultScreenProps {
  selectedOption: "SOP" | "POS";
  onBackToOptions: () => void;
  onBackToInput: () => void;
}

export default function ResultScreen({
  selectedOption,
  onBackToOptions,
  onBackToInput,
}: ResultScreenProps) {
  const { truthTableValues, numVariables } = useTruthTable();

  // Generate expression only when needed, memoized
  const expression = useMemo(() => {
    return selectedOption === "SOP"
      ? generateSOP(truthTableValues, numVariables)
      : generatePOS(truthTableValues, numVariables);
  }, [truthTableValues, numVariables, selectedOption]);

  return (
    <div className="result-screen">
      <div className="result-content">
        <div className="expression-section">
          <h3>{selectedOption} Expression:</h3>
          <div className="expression-box">
            {expression || "No expression generated yet"}
          </div>
        </div>

        <div className="diagram-section">
          <h3>Diagram:</h3>
          <Diagram expression={expression} type={selectedOption} />
        </div>
      </div>

      <div>
        <button onClick={onBackToOptions}>Back to Options</button>
        <button onClick={onBackToInput}>Back to Truth Table</button>
      </div>
    </div>
  );
}
