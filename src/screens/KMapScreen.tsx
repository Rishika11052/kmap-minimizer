import KMap from "../KMap";
import { useTruthTable } from "../context/TruthTableContext";

interface KMapScreenProps {
  highlightMode: "SOP" | "POS";
  onBackToOptions: () => void;
  onBackToInput: () => void;
}

export default function KMapScreen({
  highlightMode,
  onBackToOptions,
  onBackToInput,
}: KMapScreenProps) {
  const { truthTableValues, numVariables } = useTruthTable();

  return (
    <div className="kmap-screen">
      <h3>K-map</h3>
      <KMap
        truthTable={truthTableValues}
        numVariables={numVariables}
        highlight={highlightMode}
      />
      <div>
        <button onClick={onBackToOptions}>Back to Options</button>
        <button onClick={onBackToInput}>Back to Truth Table</button>
      </div>
    </div>
  );
}
