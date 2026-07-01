import {
  Network,
  Users,
  Terminal,
  ShieldCheck,
  Server,
  Code2,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Slug d'un module, en kebab-case. */
export type ModuleSlug =
  | "reseaux"
  | "active-directory"
  | "linux"
  | "securite"
  | "virtualisation"
  | "scripting"
  | "outils";

/** Métadonnées d'affichage d'un module TSSR. */
export interface Module {
  /** Slug utilisé dans les URLs et les noms de fichiers de données. */
  slug: ModuleSlug;
  /** Nom affiché du module. */
  name: string;
  /** Courte description du périmètre du module. */
  description: string;
  /** Sous-titre de la carte : notions clés séparées par « · ». */
  topics: string;
  /** Couleur d'accent du module (hex), calibrée pour fond sombre. */
  color: string;
  /** Icône Lucide associée au module. */
  icon: LucideIcon;
}

/** Liste ordonnée des 6 modules de la certification TSSR. */
export const MODULES: Module[] = [
  {
    slug: "reseaux",
    name: "Réseaux",
    description: "TCP/IP, VLANs, routage, DNS, DHCP et services réseau.",
    topics: "OSI · VLAN · Routage · DNS",
    color: "#7B6FD4",
    icon: Network,
  },
  {
    slug: "active-directory",
    name: "Active Directory",
    description: "Domaines, GPO, utilisateurs, groupes et stratégies.",
    topics: "OU · GPO · DNS · DHCP",
    color: "#2EB88A",
    icon: Users,
  },
  {
    slug: "linux",
    name: "Linux",
    description: "Administration, permissions, services et ligne de commande.",
    topics: "LVM · Systemd · Droits · SSH",
    color: "#E0703F",
    icon: Terminal,
  },
  {
    slug: "securite",
    name: "Sécurité",
    description: "Pare-feu, durcissement, chiffrement et bonnes pratiques.",
    topics: "Firewall · PKI · VLAN · ACL",
    color: "#D69A34",
    icon: ShieldCheck,
  },
  {
    slug: "virtualisation",
    name: "Virtualisation",
    description: "Hyperviseurs, VMs, snapshots et infrastructures virtuelles.",
    topics: "Proxmox · VMware · LXC",
    color: "#2EB88A",
    icon: Server,
  },
  {
    slug: "scripting",
    name: "Scripting",
    description: "Bash, PowerShell et automatisation des tâches d'admin.",
    topics: "Bash · PowerShell · Python",
    color: "#7B6FD4",
    icon: Code2,
  },
  {
    slug: "outils",
    name: "Outils",
    description: "Supervision, sauvegarde et gestion de parc du sysadmin.",
    topics: "Zabbix · Veeam · Bareos · GLPI",
    color: "#3FB6C9",
    icon: Wrench,
  },
];

/** Récupère un module par son slug, ou `undefined` s'il n'existe pas. */
export function getModule(slug: string): Module | undefined {
  return MODULES.find((module) => module.slug === slug);
}
