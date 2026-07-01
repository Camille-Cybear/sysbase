/** Générateurs pour les exercices réseau : routage, ACL, même sous-réseau. */

import { computeSubnet, intToIp, ipToInt } from "@/lib/subnetting";

function rint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[rint(0, arr.length - 1)] as T;
}

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

/** Réseau (network address) contenant `ip` pour un préfixe donné. */
function networkOf(ip: string, prefix: number): string {
  return computeSubnet(ip, prefix).network;
}

// --- 1. Table de routage (longest prefix match) ---

export interface Route {
  network: string;
  prefix: number;
  via: string;
}

export interface RoutingQuestion {
  dest: string;
  routes: Route[];
  correctIndex: number;
}

const INTERFACES = ["G0/0", "G0/1", "G0/2", "S0/0/0", "S0/0/1"];

export function generateRoutingQuestion(): RoutingQuestion {
  const dest = [rint(1, 223), rint(0, 255), rint(0, 255), rint(1, 254)].join(".");
  const ifaces = shuffle(INTERFACES);

  // Routes qui CONTIENNENT la destination, à des préfixes croissants.
  const matchPrefixes = shuffle([8, 16, 24]).slice(0, rint(2, 3)).sort((a, b) => a - b);
  const routes: Route[] = matchPrefixes.map((prefix, i) => ({
    network: networkOf(dest, prefix),
    prefix,
    via: ifaces[i] ?? "G0/0",
  }));

  // Une route leurre qui NE contient PAS la destination.
  let decoyNet: string;
  do {
    decoyNet = networkOf([rint(1, 223), rint(0, 255), 0, 0].join("."), 16);
  } while (decoyNet === networkOf(dest, 16));
  routes.push({ network: decoyNet, prefix: 16, via: ifaces[3] ?? "S0/0/0" });

  // Route par défaut.
  routes.push({ network: "0.0.0.0", prefix: 0, via: ifaces[4] ?? "S0/0/1" });

  const mixed = shuffle(routes);

  // Bonne réponse = route correspondante au préfixe le plus long.
  let bestIndex = -1;
  let bestPrefix = -1;
  mixed.forEach((r, i) => {
    const matches = networkOf(dest, r.prefix) === r.network;
    if (matches && r.prefix > bestPrefix) {
      bestPrefix = r.prefix;
      bestIndex = i;
    }
  });

  return { dest, routes: mixed, correctIndex: bestIndex };
}

// --- 2. ACL : le paquet passe-t-il ? ---

export interface AclRule {
  action: "permit" | "deny";
  /** Source : "any" ou un réseau CIDR. */
  source: { any: true } | { any: false; network: string; prefix: number };
  /** Port de destination : "any" ou un numéro. */
  port: number | "any";
}

export interface AclPacket {
  src: string;
  port: number;
}

export interface AclQuestion {
  rules: AclRule[];
  packet: AclPacket;
  allowed: boolean;
  /** Index de la règle décisive, ou -1 si deny implicite. */
  matchedIndex: number;
}

const COMMON_PORTS = [22, 23, 80, 443, 3389, 21, 25, 53];

function sourceMatches(rule: AclRule, src: string): boolean {
  if (rule.source.any) return true;
  return networkOf(src, rule.source.prefix) === rule.source.network;
}

export function generateAclQuestion(): AclQuestion {
  const packetSrc = [rint(1, 223), rint(0, 255), rint(0, 255), rint(1, 254)].join(".");
  const packetPort = pick(COMMON_PORTS);
  const packet: AclPacket = { src: packetSrc, port: packetPort };

  const rules: AclRule[] = [];
  const ruleCount = rint(2, 3);
  for (let i = 0; i < ruleCount; i++) {
    const action: "permit" | "deny" = Math.random() < 0.5 ? "permit" : "deny";
    // Source : parfois "any", sinon un réseau (qui contient ou non la source).
    let source: AclRule["source"];
    const r = Math.random();
    if (r < 0.35) {
      source = { any: true };
    } else if (r < 0.7) {
      // réseau qui CONTIENT la source
      const prefix = pick([24, 16]);
      source = { any: false, network: networkOf(packetSrc, prefix), prefix };
    } else {
      // réseau qui ne contient PAS la source
      let net: string;
      const prefix = 24;
      do {
        net = networkOf([rint(1, 223), rint(0, 255), rint(0, 255), 0].join("."), prefix);
      } while (net === networkOf(packetSrc, prefix));
      source = { any: false, network: net, prefix };
    }
    const port: number | "any" = Math.random() < 0.5 ? "any" : pick(COMMON_PORTS);
    rules.push({ action, source, port });
  }

  // Évaluation top-down, premier match décisif ; sinon deny implicite.
  let allowed = false;
  let matchedIndex = -1;
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (!rule) continue;
    const portOk = rule.port === "any" || rule.port === packet.port;
    if (sourceMatches(rule, packet.src) && portOk) {
      allowed = rule.action === "permit";
      matchedIndex = i;
      break;
    }
  }

  return { rules, packet, allowed, matchedIndex };
}

// --- 3. Même sous-réseau ? ---

export interface SameSubnetQuestion {
  ip1: string;
  ip2: string;
  cidr: number;
  same: boolean;
  net1: string;
  net2: string;
}

export function generateSameSubnetQuestion(): SameSubnetQuestion {
  const cidr = pick([24, 25, 26, 27, 28]);
  const block = 2 ** (32 - cidr);
  const ip1 = [192, 168, rint(0, 255), rint(1, 254)].join(".");
  const net1 = networkOf(ip1, cidr);
  const base = ipToInt(net1);

  let ip2: string;
  if (Math.random() < 0.5) {
    // même sous-réseau : autre hôte dans le même bloc
    ip2 = intToIp(base + rint(1, Math.max(1, block - 2)));
  } else {
    // sous-réseau voisin
    ip2 = intToIp(base + block + rint(1, Math.max(1, block - 2)));
  }

  const net2 = networkOf(ip2, cidr);
  return { ip1, ip2, cidr, same: net1 === net2, net1, net2 };
}
