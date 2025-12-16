// generatePOS.ts
export function generatePOS(
  outputValues: string[],
  numVariables: number
): string {
  const VARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // 1. Collect maxterms (output = 0)
  const maxterms = outputValues
    .map((v, i) => (v === "0" ? i : -1))
    .filter(i => i !== -1);

  if (!maxterms.length) return "1";

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

  // 2. Group by number of 1s
  let groups = new Map<number, string[]>();
  maxterms.forEach(m => {
    const bin = toBinary(m);
    const ones = [...bin].filter(b => b === "1").length;
    if (!groups.has(ones)) groups.set(ones, []);
    groups.get(ones)!.push(bin);
  });

  // 3. Generate prime implicants
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

  // 4. Coverage check
  const covers = (term: string, bin: string) =>
    term.split("").every((c, i) => c === "-" || c === bin[i]);

  const binaries = maxterms.map(toBinary);

  // 5. Essential prime implicants
  const essential = new Set<string>();
  binaries.forEach(bin => {
    const cover = [...primes].filter(p => covers(p, bin));
    if (cover.length === 1) essential.add(cover[0]);
  });

  // 6. Convert to POS string
  return [...essential]
    .map(t =>
      "(" +
      t
        .split("")
        .map((b, i) =>
          b === "0" ? VARS[i] : b === "1" ? VARS[i] + "'" : ""
        )
        .filter(Boolean)
        .join(" + ") +
      ")"
    )
    .join(" ");
}
