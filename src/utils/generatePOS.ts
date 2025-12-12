// generatePOS.ts
export function generatePOS(outputValues: string[], numVariables: number): string {
  const vars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const terms: string[] = [];

  outputValues.forEach((val, rowIndex) => {
    if (val === "0") {
      const binary = rowIndex.toString(2).padStart(numVariables, "0");
      const term = binary
        .split("")
        .map((b, i) => (b === "0" ? vars[i] : vars[i] + "'"))
        .join(" + ");
      terms.push("(" + term + ")");
    }
  });

  return terms.length ? terms.join(" ") : "1";
}
