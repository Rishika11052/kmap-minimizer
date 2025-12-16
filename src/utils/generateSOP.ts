// generateSOP.ts
export function generateSOP(
  outputValues: string[],
  numVariables: number
): string {
  const VARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const minterms = outputValues
    .map((v, i) => (v === "1" ? i : -1))
    .filter(i => i !== -1);

  if (!minterms.length) return "0";

  
  const toBinary = (n: number) =>
    n.toString(2).padStart(numVariables, "0");

  const combine = (a: string, b: string): string | null => {
    let diff = 0;
    let res = "";
    for (let i = 0; i < a.length; i++) {
      if (a[i] === b[i]) res += a[i];
      else {
        diff++;
        res += "-";
      }
    }
    return diff === 1 ? res : null;
  };

  
  let groups = new Map<number, string[]>();
  minterms.forEach(m => {
    const bin = toBinary(m);
    const ones = [...bin].filter(b => b === "1").length;
    if (!groups.has(ones)) groups.set(ones, []);
    groups.get(ones)!.push(bin);
  });

  const primes = new Set<string>();

  while (groups.size) {
    const next = new Map<number, string[]>();
    const used = new Set<string>();
    const keys = [...groups.keys()].sort((a, b) => a - b);

    for (let i = 0; i < keys.length - 1; i++) {
      for (const a of groups.get(keys[i])!) {
        for (const b of groups.get(keys[i + 1])!) {
          const c = combine(a, b);
          if (c) {
            used.add(a);
            used.add(b);
            const ones = [...c].filter(x => x === "1").length;
            if (!next.has(ones)) next.set(ones, []);
            if (!next.get(ones)!.includes(c)) next.get(ones)!.push(c);
          }
        }
      }
    }

    for (const g of groups.values()) {
      for (const t of g) if (!used.has(t)) primes.add(t);
    }

    groups = next;
  }

 
  const covers = (term: string, bin: string) =>
    term.split("").every((c, i) => c === "-" || c === bin[i]);

  const binaries = minterms.map(toBinary);

 
  const essential = new Set<string>();
  binaries.forEach(bin => {
    const cover = [...primes].filter(p => covers(p, bin));
    if (cover.length === 1) essential.add(cover[0]);
  });

 
  return [...essential]
    .map(t =>
      t
        .split("")
        .map((b, i) =>
          b === "1" ? VARS[i] : b === "0" ? VARS[i] + "'" : ""
        )
        .join("")
    )
    .join(" + ");
}
