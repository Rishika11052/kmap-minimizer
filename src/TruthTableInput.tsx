import React, { useState, useMemo, useEffect } from "react";
import "./css/truthtable.css";

interface TruthTableInputProps {
  onValuesChange?: (values: string[]) => void;
  initialValues?: string[];
}

// Helper: Generate truth table rows for n variables
const generateRows = (numVars: number): string[][] => {
  const totalRows = 2 ** numVars;
  const rows: string[][] = [];

  for (let i = 0; i < totalRows; i++) {
    const row: string[] = [];
    for (let j = numVars - 1; j >= 0; j--) {
      row.push(((i >> j) & 1).toString());
    }
    rows.push(row);
  }
  return rows;
};

const TruthTableInput: React.FC<TruthTableInputProps> = ({ 
  onValuesChange, 
  initialValues = [] 
}) => {
  // Simple: Load initial values once, that's it
  const [numVariables, setNumVariables] = useState(() =>
    initialValues.length > 0 ? Math.round(Math.log2(initialValues.length)) : 2
  );

  const [outputValues, setOutputValues] = useState(() =>
    initialValues.length > 0 ? initialValues : Array(4).fill("0")
  );

  // Initialize context with default values on mount
  useEffect(() => {
    if (initialValues.length === 0 && onValuesChange) {
      onValuesChange(Array(4).fill("0"));
    }
  }, []); // Run only once on mount

  // Generate rows based on current number of variables
  const rows = useMemo(() => generateRows(numVariables), [numVariables]);

  // When user changes dropdown, resize the array while preserving values
  const handleVariableChange = (newNumVars: number) => {
    setNumVariables(newNumVars);
    const newSize = 2 ** newNumVars;
    const oldSize = outputValues.length;
    
    let newValues: string[];
    if (newSize <= oldSize) {
      // Reducing: trim to new size
      newValues = outputValues.slice(0, newSize);
    } else {
      // Increasing: keep old values, fill rest with "0"
      newValues = [...outputValues, ...Array(newSize - oldSize).fill("0")];
    }
    
    setOutputValues(newValues);
    onValuesChange?.(newValues);
  };

  // When user types, update local state AND context
  const handleOutputChange = (index: number, value: string) => {
    const newValues = [...outputValues];
    newValues[index] = value;
    setOutputValues(newValues);
    onValuesChange?.(newValues); // Update context immediately
  };

  // Memoized variable labels
  const variableLabels = useMemo(
    () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").slice(0, numVariables),
    [numVariables]
  );

  return (
    <div className="tt-container">
      <div className="tt-select-container">
        <label htmlFor="variables">Number of variables:</label>
        <select
          id="variables"
          value={numVariables}
          onChange={(e) => handleVariableChange(parseInt(e.target.value, 10))}
        >
          {[2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div 
        className={`tt-table-wrapper ${rows.length > 8 ? 'scrollable' : ''}`}
      >
        <table className="tt-table">
          <thead>
            <tr>
              {variableLabels.map((label, i) => (
                <th key={i}>{label}</th>
              ))}
              <th>X</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((val, colIndex) => (
                  <td key={colIndex} className="var-cell">
                    {val}
                  </td>
                ))}
                <td 
                  className="var-cell input-cell" 
                  onClick={() => {
                    const currentVal = outputValues[rowIndex] || "0";
                    const newVal = currentVal === "0" ? "1" : "0";
                    handleOutputChange(rowIndex, newVal);
                  }}
                >
                  {outputValues[rowIndex] || "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TruthTableInput;
