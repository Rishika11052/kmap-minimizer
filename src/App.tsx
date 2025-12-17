import { useState } from "react";
import TruthTableInput from "./TruthTableInput";
import Diagram from "./Diagram";
import { generateSOP } from "./utils/generateSOP";
import { generatePOS } from "./utils/generatePOS";
import { generateVerilog } from "./utils/generateVerilog";
import KMap from "./KMap";
// import "./truthtable.css";
import "./css/App.css";

function App() {
  const [truthTableValues, setTruthTableValues] = useState<string[]>([]);
  const numVariables = Math.round(Math.log2(truthTableValues.length));
  const [screen, setScreen] = useState<"input" | "options" | "result" | "KMAP"|"verilog">("input");
  const [selectedOption, setSelectedOption] = useState<"SOP" | "POS" | "">("");
  const [expression, setExpression] = useState("");
  // const [kmapHighlight, setKmapHighlight] = useState<"SOP" | "POS">("SOP");

  // 1. Add this function inside the App component, before the return statement
  const handleCompute = () => {
    // Check if every value in the current state is empty or just default
    const isTableEmpty = truthTableValues.length === 0 || 
                        truthTableValues.every(val => val === "" || val === null);

    if (isTableEmpty) {
      alert("Please enter values in the truth table first!");
      return; // This stops the app from moving to the 'options' screen
    }

    setScreen("options");
  };

  // 2. To prevent "ghost" values from previous usage, 
  // update your "Back to Truth Table" buttons to clear the state:
  const handleBackToInput = () => {
    setTruthTableValues([]); // Resets the data
    setScreen("input");      // Goes back
  };

  // Handle clicking SOP or POS
  const handleOptionSelect = (option: "SOP" | "POS") => {
    setSelectedOption(option);
    const expr =
      option === "SOP"
        ? generateSOP(truthTableValues, numVariables)
        : generatePOS(truthTableValues, numVariables);

    setExpression(expr);
    setScreen("result");
  };

  return (
    <div className="App">
      <h1>KMAP Minimizer</h1>

      {/* --- Truth Table Input Screen --- */}
      {screen === "input" && (
        <>
          <TruthTableInput onValuesChange={setTruthTableValues} />
          <button className="compute-btn" onClick={handleCompute}>
            Compute
          </button>
        </>
      )}


      {/* --- Options Screen --- */}
      {screen === "options" && (
        <div className="options-screen-container">
          
          <div className="options-grid">                
            <div className="option-box" onClick={() => handleOptionSelect("SOP")}>
              <h2>SOP</h2>
            </div>          
            <div className="option-box" onClick={() => handleOptionSelect("POS")}>
              <h2>POS</h2>
            </div>             
            <div className="option-box" onClick={() => setScreen("verilog")}>
              <h2>Verilog</h2>
            </div>
            <div
              className="option-box"
              onClick={() => {
                if (!selectedOption) {
                  setSelectedOption("SOP");
                }
                setScreen("KMAP");
              }}
            >
              <h2>K-map</h2>
            </div>            
          </div>

          <div className="back-button-container">
            <button className="back-btn" onClick={handleBackToInput}>
              Back to Truth Table
            </button>
          </div>
        </div>
      )}

      {/* --- SOP/POS Result Screen --- */}
      {screen === "result" && (
        <div className="result-screen">
          <h3>{selectedOption} Expression:</h3>

          <div className="expression-box">
            {expression || "No expression generated yet"}
          </div>

          <h3>Diagram:</h3>
          {selectedOption && (
            <Diagram expression={expression} type={selectedOption} />
          )}

          <div style={{ marginTop: "20px" }}>
            <button onClick={() => setScreen("options")}>Back to Options</button>
            <button onClick={() => setScreen("input")}>Back to Truth Table</button>
          </div>

          {/* <h3>K-map:</h3>
          <KMap
            truthTable={truthTableValues}
            numVariables={numVariables}
            highlight={selectedOption === "SOP" ? "SOP" : selectedOption === "POS" ? "POS" : undefined}
          /> */}
        </div>
      )}

      {screen === "KMAP" && (
        
        <div className="kmap-screen">

          <h3>K-map ({"SOP"})</h3>
          <KMap
            truthTable={truthTableValues}
            numVariables={numVariables}
            highlight={"SOP"} // will now highlight 1's or 0's
          />

          <div style={{ marginTop: "20px" }}>
            <button onClick={() => setScreen("options")}>Back to Options</button>
            <button onClick={() => setScreen("input")}>Back to Truth Table</button>
          </div>
        </div>
      )}



      {/* --- Verilog Screen --- */}
      {screen === "verilog" && (
        <div className="verilog-screen">
          <h3>Generated Verilog Code</h3>
          <pre className="verilog-box">
            {generateVerilog(
              "",
              "SOP",
              numVariables,
              truthTableValues
            )}
          </pre>
          <div style={{ marginTop: "20px" }}>
            <button onClick={() => setScreen("options")}>Back to Options</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
