import React from "react";
import "./css/KMap.css";

type KMapProps = {
  truthTable: string[];
  numVariables: number;
  highlight?: "SOP" | "POS";
};



/* Proper Gray code generator */
function grayCode(bits: number): number[] {
  const result: number[] = [];
  const size = 1 << bits;
  for (let i = 0; i < size; i++) {
    result.push(i ^ (i >> 1));
  }
  return result;
}

function toBinaryString(n: number, bits: number): string {
  return n.toString(2).padStart(bits, "0");
}

function buildKMap(truthTable: string[], numVars: number) {
  const rowBits = Math.ceil(numVars / 2);
  const colBits = Math.floor(numVars / 2);

  const rows = 1 << rowBits;
  const cols = 1 << colBits;

  const rowGray = grayCode(rowBits);
  const colGray = grayCode(colBits);

  const rowLabels = rowGray.map(v => toBinaryString(v, rowBits));
  const colLabels = colGray.map(v => toBinaryString(v, colBits));

  const map: string[][] = Array.from({ length: rows }, () =>
    Array(cols).fill("0")
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const index = (rowGray[r] << colBits) | colGray[c];
      map[r][c] = truthTable[index] ?? "0";
    }
  }

  return { map, rowLabels, colLabels };
}



const KMap: React.FC<KMapProps> = ({
  truthTable,
  numVariables,
  highlight
}) => {
  console.log("vars:", numVariables, "truthTable length:", truthTable.length);

  const { map, rowLabels, colLabels } =
    buildKMap(truthTable, numVariables);

  return (
    <div className="kmap-container">
      <div className="kmap-table-wrapper">
        <table className="kmap-table">
          <thead>
            <tr>
              <th></th>
              {colLabels.map((label, i) => (
                <th key={i} className="kmap-label-col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {map.map((row, rIdx) => (
              <tr key={rIdx}>
                <th className="kmap-label-row">
                  {rowLabels[rIdx]}
                </th>
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`kmap-cell ${
                      highlight === "SOP" && cell === "1"
                        ? "highlight"
                        : ""
                    } ${
                      highlight === "POS" && cell === "0"
                        ? "highlight-pos"
                        : ""
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
    </div>
  );
};


export default KMap;
