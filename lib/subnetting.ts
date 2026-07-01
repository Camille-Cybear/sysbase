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

export function ipToInt(ip: string): number {
  const [a = 0, b = 0, c = 0, d = 0] = ip.split(".").map(Number);
  return ((a << 24) | (b << 16) | (c << 8) | d) >>> 0;
}

export function intToIp(n: number): string {
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

// --- VLSM (Variable Length Subnet Masking) ---

/** Un besoin : un nom de sous-réseau et un nombre d'hôtes requis. */
export interface VlsmRequirement {
  label: string;
  hosts: number;
}

/** Allocation calculée pour un besoin. */
export interface VlsmAllocation extends VlsmRequirement {
  prefix: number;
  block: number;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
}

/** Énoncé complet d'un exercice VLSM. */
export interface VlsmQuestion {
  baseIp: string;
  basePrefix: number;
  /** Besoins triés par nombre d'hôtes décroissant. */
  requirements: VlsmRequirement[];
  /** Solution (même ordre que `requirements`). */
  allocations: VlsmAllocation[];
}

/** Plus petit préfixe (plus grand bloc) offrant assez d'hôtes utilisables. */
export function prefixForHosts(hosts: number): number {
  let block = 4; // /30 → 2 hôtes utilisables
  while (block - 2 < hosts) block *= 2;
  return 32 - Math.log2(block);
}

const VLSM_LABELS = [
  "Production",
  "Bureaux",
  "Wifi",
  "Direction",
  "Serveurs",
  "Invités",
  "Téléphonie",
  "DMZ",
  "Comptabilité",
  "Atelier",
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rint(0, i);
    const tmp = copy[i] as T;
    copy[i] = copy[j] as T;
    copy[j] = tmp;
  }
  return copy;
}

/** Génère des tailles de blocs (puissances de 2, décroissantes) qui tiennent. */
function genBlocks(baseSize: number, count: number): number[] {
  const blocks: number[] = [];
  let remaining = baseSize;
  let cap = baseSize / 2; // ne pas consommer tout le réseau d'un coup
  for (let i = 0; i < count; i++) {
    const rest = count - 1 - i;
    const maxAllowed = Math.min(cap, remaining - 4 * rest);
    const choices: number[] = [];
    for (let b = 4; b <= maxAllowed; b *= 2) choices.push(b);
    // Le 1er bloc est biaisé vers le haut pour garantir un gros sous-réseau
    // (donc de la variété) ; les suivants sont libres.
    const minIdx = i === 0 ? Math.floor(choices.length / 2) : 0;
    const block = choices[rint(minIdx, choices.length - 1)] ?? 4;
    blocks.push(block);
    remaining -= block;
    cap = block;
  }
  return blocks.sort((a, b) => b - a);
}

/** Alloue les besoins (triés décroissants) bout à bout depuis le réseau de base. */
function allocate(baseIp: string, reqs: VlsmRequirement[]): VlsmAllocation[] {
  let cursor = ipToInt(baseIp);
  return reqs.map((req) => {
    const prefix = prefixForHosts(req.hosts);
    const block = 2 ** (32 - prefix);
    const network = cursor;
    const broadcast = cursor + block - 1;
    cursor = broadcast + 1;
    return {
      ...req,
      prefix,
      block,
      network: intToIp(network),
      broadcast: intToIp(broadcast),
      firstHost: intToIp(network + 1),
      lastHost: intToIp(broadcast - 1),
    };
  });
}

/** Génère un exercice VLSM selon le niveau. */
export function generateVlsmQuestion(level: Level): VlsmQuestion {
  let baseOctets: number[];
  let basePrefix: number;
  let count: number;

  if (level === "easy") {
    baseOctets = [192, 168, rint(0, 255), 0];
    basePrefix = 24;
    count = 3;
  } else if (level === "medium") {
    baseOctets = [172, 16, rint(0, 255), 0];
    basePrefix = 24;
    count = 4;
  } else {
    baseOctets = [10, rint(0, 255), 2 * rint(0, 127), 0]; // aligné /23
    basePrefix = 23;
    count = 5;
  }

  const baseIp = baseOctets.join(".");
  const baseSize = 2 ** (32 - basePrefix);
  const blocks = genBlocks(baseSize, count);
  const labels = shuffle(VLSM_LABELS).slice(0, count);

  const requirements: VlsmRequirement[] = blocks
    .map((block, i) => ({
      label: labels[i] ?? `LAN ${i + 1}`,
      hosts: rint(Math.max(1, block / 2 - 1), block - 2),
    }))
    .sort((a, b) => b.hosts - a.hosts);

  return {
    baseIp,
    basePrefix,
    requirements,
    allocations: allocate(baseIp, requirements),
  };
}
