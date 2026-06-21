import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ancre le tracing des fichiers à la racine du projet (évite l'inférence
  // erronée quand un lockfile existe dans un dossier parent).
  outputFileTracingRoot: path.dirname(new URL(import.meta.url).pathname),
};

export default nextConfig;
