/** Conversions de permissions Linux : octal ⇄ symbolique (rwx). */

const BITS: { value: number; char: string }[] = [
  { value: 4, char: "r" },
  { value: 2, char: "w" },
  { value: 1, char: "x" },
];

/** Un chiffre octal (0–7) → triplet symbolique (ex. 5 → "r-x"). */
export function octalDigitToSymbolic(digit: number): string {
  return BITS.map((b) => (digit & b.value ? b.char : "-")).join("");
}

/** Octal complet → symbolique (ex. "755" → "rwxr-xr-x"). */
export function octalToSymbolic(octal: string): string {
  return octal
    .split("")
    .map((d) => octalDigitToSymbolic(Number(d)))
    .join("");
}

/** Symbolique → octal (ex. "rwxr-xr-x" → "755"). */
export function symbolicToOctal(symbolic: string): string {
  let out = "";
  for (let i = 0; i < 9; i += 3) {
    const group = symbolic.slice(i, i + 3);
    let n = 0;
    if (group[0] === "r") n += 4;
    if (group[1] === "w") n += 2;
    if (group[2] === "x") n += 1;
    out += String(n);
  }
  return out;
}

/** Génère une permission octale aléatoire (droits plausibles). */
export function randomOctalPermission(): string {
  // Le propriétaire a souvent au moins la lecture ; on varie le reste.
  const owner = [7, 6, 5, 4];
  const other = [7, 6, 5, 4, 0, 1, 2, 3];
  const pick = (arr: number[]) => arr[Math.floor(Math.random() * arr.length)] ?? 0;
  return `${pick(owner)}${pick(other)}${pick(other)}`;
}
