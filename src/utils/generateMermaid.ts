export function generateSOPMermaid(sop: string): string {
  if (!sop) return "graph TD\nOUT[No expression]";
  if (sop.trim() === "0") return "graph TD\nOUT[0]";
  if (sop.trim() === "1") return "graph TD\nOUT[1]";


  const lines: string[] = ["graph LR"];
  const input = sop.trim();

  // Split on "+" for SOP terms
  const terms = input.split(/\+/).map(t => t.trim()).filter(Boolean);
  const andOutputs: string[] = [];

  terms.forEach((term, i) => {
    const andId = `AND${i}`;
    const nodes: string[] = [];

    // Split literals (no explicit separator, just adjacency like "AB'C")
    const literals = term.match(/[A-Za-z]'+?|[A-Za-z]/g) || [];

    literals.forEach((lit, j) => {
      const hasNot = lit.endsWith("'");
      const varName = hasNot ? lit.slice(0, -1) : lit;

      // unique node ids per literal occurrence
      const nodeId = `${varName}_${i}_${j}`;
      lines.push(`${nodeId}[${varName}]`);

      if (hasNot) {
        const notId = `NOT_${i}_${j}`;
        lines.push(`${nodeId} --> ${notId}[NOT]`);
        nodes.push(notId);
      } else {
        nodes.push(nodeId);
      }
    });

    // connect literals into AND gate
    if (nodes.length === 1) {
      // Single literal term: no AND gate needed
      andOutputs.push(nodes[0]);
    } else {
      // Multiple literals: use AND gate
      nodes.forEach(n => lines.push(`${n} --> ${andId}[AND]`));
      andOutputs.push(andId);
    }

  });  

  if (andOutputs.length === 1) {
    // Single term → direct output
    lines.push(`${andOutputs[0]} --> OUT[Output]`);
  } else if (andOutputs.length > 1) {
    // Multiple terms → OR gate required
    const orId = "OR0";
    andOutputs.forEach(andId => lines.push(`${andId} --> ${orId}[OR]`));
    lines.push(`${orId} --> OUT[Output]`);
  }


  // lines.push(`${orId} --> OUT[Output]`);
  return lines.join("\n");
}



// Improved POS generator — handles "(A + B')", "A + B'", and multiple parenthesized clauses
export function generatePOSMermaid(pos: string): string {
  if (!pos || pos.trim() === "1") return "graph TD\nOUT[No 0s in POS]";

  const lines: string[] = ["graph LR"];
  const input = pos.trim();

  // 1) Try to extract parenthesized clauses first: "(...)".
  const parenClauses = input.match(/\([^)]*\)/g);
  let clauses: string[] = [];

  if (parenClauses && parenClauses.length > 0) {
    clauses = parenClauses.map(c => c.slice(1, -1).trim()).filter(Boolean);
  } else {
    // 2) No parentheses — try splitting on common clause separators (* , ; ×)
    if (/[,;·×]/.test(input)) {
      clauses = input.split(/[,;·×]/).map(s => s.trim()).filter(Boolean);
    } else {
      // 3) Fallback: treat the entire input as a single clause (e.g. "A + B'")
      clauses = [input];
    }
  }

  const orOutputs: string[] = [];
  const usedVars = new Set<string>();

  clauses.forEach((clause, i) => {
    const termId = `OR${i}`;
    const nodes: string[] = [];

    // normalize plus signs and split literals
    const cleaned = clause.replace(/\s*\+\s*/g, " + ").trim();
    const literals = cleaned === "" ? [] : cleaned.split(" + ").map(s => s.trim()).filter(Boolean);
    if (literals.length === 0) return;

    literals.forEach((lit, j) => {
      const hasNot = lit.endsWith("'");
      const varName = hasNot ? lit.slice(0, -1).trim() : lit;
      usedVars.add(varName);

      // unique node ids per literal occurrence
      const nodeId = `${varName}_${i}_${j}`;
      lines.push(`${nodeId}[${varName}]`);

      if (hasNot) {
        const notId = `NOT_${varName}_${i}_${j}`;
        // unique NOT node label so Mermaid doesn't collapse them
        lines.push(`${nodeId} --> ${notId}[NOT]`);
        nodes.push(notId);
      } else {
        nodes.push(nodeId);
      }
    });

    if (nodes.length === 1) {
      // Single literal → no OR gate
      orOutputs.push(nodes[0]);
    } else {
      // Multiple literals → OR gate needed
      nodes.forEach(n => lines.push(`${n} --> ${termId}[OR]`));
      orOutputs.push(termId);
    }

  });

  if (orOutputs.length === 1) {
    // Single clause → no AND gate
    lines.push(`${orOutputs[0]} --> OUT[Output]`);
  } else if (orOutputs.length > 1) {
    const andId = "AND0";
    orOutputs.forEach(orId => lines.push(`${orId} --> ${andId}[AND]`));
    lines.push(`${andId} --> OUT[Output]`);
  }

  return lines.join("\n");
}


