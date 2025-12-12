import React, { useState, useEffect } from "react";
import "./css/truthtable.css"

interface TruthTableInputProps {
  onValuesChange?: (values: string[]) => void; // send last column values to parent
}

const TruthTableInput: React.FC<TruthTableInputProps> = ({ onValuesChange }) => {
  const [numVariables, setNumVariables] = useState(2);
  const [rows, setRows] = useState<string[][]>([]);
  const [outputValues, setOutputValues] = useState<string[]>([]);

  // Generate truth table rows for n variables
  const generateRows = (n: number) => {
    const totalRows = 2 ** n;
    const tempRows: string[][] = [];

    for (let i = 0; i < totalRows; i++) {
      const row: string[] = [];
      for (let j = n - 1; j >= 0; j--) {
        row.push(((i >> j) & 1).toString());
      }
      tempRows.push(row);
    }
    return tempRows;
  };

  // Update table when numVariables changes
  useEffect(() => {
    const newRows = generateRows(numVariables);
    setRows(newRows);
    setOutputValues(Array(newRows.length).fill(""));
  }, [numVariables]);

  const handleOutputChange = (index: number, value: string) => {
    const newValues = [...outputValues];
    newValues[index] = value;
    setOutputValues(newValues);
    onValuesChange?.(newValues);
  };

  return (
    <div className="tt-container">
      {/* <h2 className="tt-title">Truth Table Input</h2> */}

      <div className="tt-select-container">
        <label htmlFor="variables">Number of variables:</label>
        <select
          id="variables"
          value={numVariables}
          onChange={(e) => setNumVariables(parseInt(e.target.value))}
        >
          {[2, 3, 4,5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <table className="tt-table">
        <thead>
          <tr>
            {Array.from({ length: numVariables }, (_, i) => (
              <th key={i}>{"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i]}</th>
            ))}
            <th>X</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((val, i) => (
                <td key={i} className="var-cell">{val}</td>
              ))}
              <td>
                <input
                type="number"
                    value={outputValues[rowIndex]}
                    onChange={(e) => {
                        let val = e.target.value;
                        if (val !== "0" && val !== "1") val = "0"; // default to 0 if invalid
                        handleOutputChange(rowIndex, val);
                    }}
                    min={0}
                    max={1}
                    step={1}
                    className="tt-input"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TruthTableInput;
