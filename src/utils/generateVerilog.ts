export function generateVerilog(
  expression: string,
  option: "SOP" | "POS",
  numVariables: number
): string {
  // Define variable names: A, B, C, D, E...
  const variables = ["A", "B", "C", "D", "E"].slice(0, numVariables);

  // Replace Boolean notation with Verilog
  const verilogExpr = expression
    .replace(/ /g, "")        // remove spaces
    .replace(/\+/g, " | ")    // OR
    .replace(/'/g, "~")       // NOT
    .replace(/([A-Za-z])(?=[A-Za-z~])/g, "$1 & "); 
    // add & between consecutive literals like AB → A & B

  // Build module
  return `
module ${option.toLowerCase()}_example(${variables.map(v => "input " + v).join(", ")}, output F);
  assign F = ${verilogExpr};
endmodule
`;
}
