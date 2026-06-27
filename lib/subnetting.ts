/**
 * Calculs de subnetting (réseau, broadcast, hôtes…) et génération de questions
 * aléatoires pour les exercices. Logique pure, réutilisable (subnetting, VLSM…).
 */

export type Level = "easy" | "medium" | "hard";

/** Une question : une IP et un préfixe CIDR. */
export interface SubnetQuestion {
  ip: string;
  cidr: number;
}

/** Résultat complet d'un calcul de sous-réseau. */
export interface SubnetInfo {
  mask: string;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  hosts: number;
  /** Taille du bloc sur l'octet « intéressant » (ex. 64). */
  block: number;
  /** Index (0–3) de l'octet où se joue le découpage. */
  octetIndex: number;
  /** Valeur de début du bloc dans cet octet. */
  octetStart: number;
  /** Valeur de l'IP dans cet octet. */
  ipOctet: number;
}

function ipToInt(ip: string): number {
  const [a = 0, b = 0, c = 0, d = 0] = ip.split(".").map(Number);
  return ((a << 24) | (b << 16) | (c << 8) | d) >>> 0;
}

function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

function rint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Calcule toutes les caractéristiques d'un sous-réseau `ip/cidr`. */
export function computeSubnet(ip: string, cidr: number): SubnetInfo {
  const octets = ip.split(".").map(Number);
  const ipInt = ipToInt(ip);
  const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const net = (ipInt & mask) >>> 0;
  const broadcast = (net | (~mask >>> 0)) >>> 0;

  const rem = cidr % 8;
  const block = rem === 0 ? 256 : 2 ** (8 - rem);
  let octetIndex = rem === 0 ? cidr / 8 : Math.floor(cidr / 8);
  if (octetIndex > 3) octetIndex = 3;
  const ipOctet = octets[octetIndex] ?? 0;
  const octetStart = ipOctet - (ipOctet % block);

  return {
    mask: intToIp(mask),
    network: intToIp(net),
    broadcast: intToIp(broadcast),
    firstHost: intToIp((net + 1) >>> 0),
    lastHost: intToIp((broadcast - 1) >>> 0),
    hosts: Math.max(0, 2 ** (32 - cidr) - 2),
    block,
    octetIndex,
    octetStart,
    ipOctet,
  };
}

/**
 * Génère une question aléatoire selon le niveau :
 * - easy : /25–/30 en 192.168.x.x
 * - medium : /17–/30 en 10.x ou 172.16–31.x
 * - hard : /8–/30 sur un premier octet quelconque (hors 127)
 */
export function generateSubnetQuestion(level: Level): SubnetQuestion {
  let cidr: number;
  let octets: number[];

  if (level === "easy") {
    cidr = rint(25, 30);
    octets = [192, 168, rint(0, 255), rint(0, 255)];
  } else if (level === "medium") {
    cidr = rint(17, 30);
    octets =
      Math.random() < 0.5
        ? [10, rint(0, 255), rint(0, 255), rint(0, 255)]
        : [172, rint(16, 31), rint(0, 255), rint(0, 255)];
  } else {
    cidr = rint(8, 30);
    let first: number;
    do {
      first = rint(1, 223);
    } while (first === 127);
    octets = [first, rint(0, 255), rint(0, 255), rint(0, 255)];
  }

  return { ip: octets.join("."), cidr };
}
