import { generateSOP } from "./generateSOP";
import { generatePOS } from "./generatePOS";

function sopToVerilog(sop: string): string {
  if (sop === "0") return "1'b0";
  if (sop === "1") return "1'b1";

  return sop
    .split("+")
    .map(term => {
      const literals = term.trim().match(/[A-Z]'?/g);
      if (!literals) return "";

      const ands = literals.map(l =>
        l.endsWith("'") ? `~${l[0]}` : l
      );

      return "(" + ands.join(" & ") + ")";
    })
    .join(" | ");
}

function posToVerilog(pos: string): string {
  if (pos === "0") return "1'b0";
  if (pos === "1") return "1'b1";

  const clauses = pos.match(/\([^)]+\)/g);
  if (!clauses) return "1'b1";

  return clauses
    .map(clause => {
      const literals = clause.match(/[A-Z]'?/g);
      if (!literals) return "";

      const ors = literals.map(l =>
        l.endsWith("'") ? `~${l[0]}` : l
      );

      return "(" + ors.join(" | ") + ")";
    })
    .join(" & ");
}

export function generateVerilog(
  _expression: string,
  _option: "SOP" | "POS",
  numVariables: number,
  truthTableValues?: string[]
): string {
  const variables = ["A", "B", "C", "D", "E"].slice(0, numVariables);

  if (!truthTableValues) return "// No truth table provided";

  const sop = generateSOP(truthTableValues, numVariables);
  const pos = generatePOS(truthTableValues, numVariables);

  const sopExpr = sopToVerilog(sop);
  const posExpr = posToVerilog(pos);

  return `
module logic_example(
  ${variables.map(v => "input " + v).join(", ")},
  output F_sop,
  output F_pos
);

  assign F_sop = ${sopExpr};
  assign F_pos = ${posExpr};

endmodule
`;
}
