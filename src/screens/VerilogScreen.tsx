import { generateVerilog } from "../utils/generateVerilog";
import { useTruthTable } from "../context/TruthTableContext";

interface VerilogScreenProps {
  onBackToOptions: () => void;
}

export default function VerilogScreen({ onBackToOptions }: VerilogScreenProps) {
  const { truthTableValues, numVariables } = useTruthTable();

  return (
    <div className="verilog-screen">
      <h3>Generated Verilog Code</h3>
      <pre className="verilog-box">
        {generateVerilog("", "SOP", numVariables, truthTableValues)}
      </pre>
      <div>
        <button onClick={onBackToOptions}>Back to Options</button>
      </div>
    </div>
  );
}
