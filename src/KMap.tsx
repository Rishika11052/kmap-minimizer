import React from "react";
import "./css/KMap.css"

type KMapProps = {
  truthTable: string[];
  numVariables: number;
  highlight?: "SOP" | "POS";
};

function grayCode(n: number): number[] {
  if (n === 1) return [0, 1];
  const prev = grayCode(n - 1);
  return [...prev.map(x => x << 1), ...prev.map(x => (x << 1) | 1)];
}

function toBinaryString(n: number, bits: number): string {
  return n.toString(2).padStart(bits, "0");
}

function buildKMap(truthTable: string[], numVars: number): {
  map: string[][];
  rowLabels: string[];
  colLabels: string[];
} {
  const rowsCount = 1 << Math.ceil(numVars / 2);
  const colsCount = 1 << Math.floor(numVars / 2);

  const rowGray = grayCode(Math.ceil(numVars / 2));
  const colGray = grayCode(Math.floor(numVars / 2));

  const rowLabels = rowGray.map(r => toBinaryString(r, Math.ceil(numVars / 2)));
  const colLabels = colGray.map(c => toBinaryString(c, Math.floor(numVars / 2)));

  const map: string[][] = [];
  for (let r = 0; r < rowsCount; r++) {
    map[r] = [];
    for (let c = 0; c < colsCount; c++) {
      const index = rowGray[r] * colsCount + colGray[c];
      map[r][c] = truthTable[index] ?? "0";
    }
  }

  return { map, rowLabels, colLabels };
}

const KMap: React.FC<KMapProps> = ({ truthTable, numVariables, highlight }) => {
  const { map, rowLabels, colLabels } = buildKMap(truthTable, numVariables);

  return (
    <div className="kmap-container">
      <table className="kmap-table">
        <thead>
          <tr>
            <th></th>
            {colLabels.map((label, i) => (
              <th key={i} className="kmap-label-col">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {map.map((row, rIdx) => (
            <tr key={rIdx}>
              <th className="kmap-label-row">{rowLabels[rIdx]}</th>
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className={`kmap-cell ${
                    highlight === "SOP" && cell === "1" ? "highlight" : ""
                  } ${
                    highlight === "POS" && cell === "0" ? "highlight-pos" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KMap;
