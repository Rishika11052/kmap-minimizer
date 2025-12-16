// generatePOS.ts
import { generateSOP } from "./generateSOP";

export function generatePOS(
  outputValues: string[],
  numVariables: number
): string {
  const sop = generateSOP(outputValues, numVariables);

  // Edge cases
  if (sop === "0") return "1";
  if (sop === "1") return "0";

  // SOP → POS (dual)
  // A'B + C  →  (A' + B)(C)
  return sop
    .split("+")
    .map(term => {
      const literals = term.trim().match(/[A-Z]'?/g);
      if (!literals) return "";
      return "(" + literals.join(" + ") + ")";
    })
    .join("");
}
