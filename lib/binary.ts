/**
 * Conversions binaire ⇄ décimal et génération de questions pour l'exercice.
 * Logique pure, sans dépendance UI.
 */

export type Direction = "decToBin" | "binToDec";
export type Format = "octet" | "ip";

export interface BinaryQuestion {
  direction: Direction;
  format: Format;
  /** Valeurs décimales source (1 octet, ou 4 pour une IP). */
  octets: number[];
}

/** Poids des 8 bits d'un octet, de gauche à droite. */
export const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

function rint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Octet décimal → binaire sur 8 bits (ex. 192 → "11000000"). */
export function toBinaryOctet(n: number): string {
  return n.toString(2).padStart(8, "0");
}

/** Génère une question selon le sens et le format. */
export function generateBinaryQuestion(
  direction: Direction,
  format: Format,
): BinaryQuestion {
  const octets =
    format === "octet"
      ? [rint(0, 255)]
      : [rint(1, 223), rint(0, 255), rint(0, 255), rint(0, 255)];
  return { direction, format, octets };
}

/** Ce qui est montré à l'utilisateur (la valeur à convertir). */
export function questionDisplay(q: BinaryQuestion): string {
  return q.direction === "decToBin"
    ? q.octets.join(".")
    : q.octets.map(toBinaryOctet).join(".");
}

/** Réponse canonique attendue. */
export function expectedAnswer(q: BinaryQuestion): string {
  return q.direction === "decToBin"
    ? q.octets.map(toBinaryOctet).join(".")
    : q.octets.join(".");
}

/**
 * Vérifie la saisie (tolérante aux espaces et aux zéros de tête).
 * Le nombre de groupes (séparés par des points) doit correspondre.
 */
export function checkBinaryAnswer(q: BinaryQuestion, input: string): boolean {
  const groups = input.trim().replace(/\s/g, "").split(".");
  if (groups.length !== q.octets.length) return false;

  return groups.every((group, i) => {
    const expected = q.octets[i];
    if (expected === undefined) return false;
    if (q.direction === "decToBin") {
      return /^[01]+$/.test(group) && parseInt(group, 2) === expected;
    }
    return /^\d+$/.test(group) && Number(group) === expected;
  });
}
