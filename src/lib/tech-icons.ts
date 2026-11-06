// Icons for the technologies in a project's stack. Mirrors the icon set of the Jumawan portfolio so both sites
// show the same logos. A technology without an entry simply shows its name.

// "Next.js", "NextJS" and "next js" are the same technology; "C#" and "C++" keep their symbol so they stay distinct from "C"
const key = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9#+]/g, "")
    .replace(/js$/, "");

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const SIMPLE = "https://cdn.simpleicons.org";
const dev = (name: string, variant = "original") => `${DEVICON}/${name}/${name}-${variant}.svg`;

const ICONS: Record<string, string> = {
  // Languages
  typescript: dev("typescript"),
  javascript: dev("javascript"),
  python: dev("python"),
  php: dev("php"),
  kotlin: dev("kotlin"),
  swift: dev("swift"),
  java: dev("java"),
  html: dev("html5"),
  css: dev("css3"),
  c: dev("c"),
  "c#": dev("csharp"),
  "c++": dev("cplusplus"),
  dart: dev("dart"),
  go: dev("go"),
  latex: dev("latex"),
  matlab: dev("matlab"),
  // Front end
  react: dev("react"),
  next: dev("nextjs"),
  svelte: dev("svelte"),
  vite: dev("vitejs"),
  tailwindcss: dev("tailwindcss"),
  bootstrap: dev("bootstrap"),
  angular: dev("angularjs"),
  alpine: dev("alpinejs"),
  handlebars: dev("handlebars"),
  zustand: dev("zustand"),
  shadcnui: `${SIMPLE}/shadcnui`,
  framermotion: `${SIMPLE}/framer`,
  zod: `${SIMPLE}/zod`,
  radixui: `${SIMPLE}/radixui`,
  tanstackquery: `${SIMPLE}/reactquery`,
  tanstackstart: `${SIMPLE}/tanstack`,
  pwa: `${SIMPLE}/pwa`,
  leaflet: `${SIMPLE}/leaflet`,
  googlemapssdk: `${SIMPLE}/googlemaps`,
  // Back end
  node: dev("nodejs"),
  express: dev("express"),
  laravel: dev("laravel"),
  django: dev("django", "plain"),
  flask: dev("flask"),
  fastapi: dev("fastapi"),
  jinja2: `${SIMPLE}/jinja`,
  hono: `${SIMPLE}/hono`,
  bun: dev("bun"),
  prisma: dev("prisma"),
  drizzleorm: `${SIMPLE}/drizzle`,
  jwt: `${SIMPLE}/jsonwebtokens`,
  pusher: `${SIMPLE}/pusher`,
  // Data
  mysql: dev("mysql"),
  postgresql: dev("postgresql"),
  supabase: dev("supabase"),
  firebase: dev("firebase"),
  convex: `${SIMPLE}/convex`,
  redis: dev("redis"),
  sqlserver: dev("microsoftsqlserver"),
  pandas: dev("pandas"),
  streamlit: `${SIMPLE}/streamlit`,
  jupyternotebook: dev("jupyter"),
  mermaid: `${SIMPLE}/mermaid`,
  // Mobile and desktop
  expo: dev("expo"),
  flutter: dev("flutter"),
  android: dev("android"),
  electron: dev("electron"),
  net: dev("dotnetcore"),
  maven: dev("maven"),
  // Smart features
  keras: dev("keras"),
  opencv: dev("opencv"),
  googlegeminiai: `${SIMPLE}/googlegemini`,
  // Hardware
  arduino: dev("arduino"),
  esp32: `${SIMPLE}/espressif`,
  ciscopackettracer: "https://upload.wikimedia.org/wikipedia/en/d/dc/Cisco_Packet_Tracer_Icon.png",
  tinkercadcircuits: `${SIMPLE}/autodesk`,
  // Tools and platforms
  vercel: `${SIMPLE}/vercel`,
  docker: dev("docker"),
  linux: dev("linux"),
  git: dev("git"),
  apache: dev("apache"),
  windowsserver: dev("windows8"),
  markdown: dev("markdown"),
};

// Variants that share another technology's logo
const ALIASES: Record<string, string> = {
  reactnative: "react",
  reactnavigation: "react",
  blade: "laravel",
  laravelwebsockets: "laravel",
  sveltekit: "svelte",
  javaswing: "java",
  firestore: "firebase",
  googlemaps: "googlemapssdk",
  vercelfunctions: "vercel",
  nativewind: "tailwindcss",
  djangorestframework: "django",
  djangochannels: "django",
  hilt: "android",
  room: "android",
  retrofit: "android",
  workmanager: "android",
  windowsforms: "net",
  netmaui: "net",
  xaml: "net",
  pyodbc: "python",
  altair: "python",
  activedirectory: "windowsserver",
  angularjs: "angular",
};

// Logos drawn in black or near-black; on a dark background they are shown in white instead
const DARK_LOGOS = new Set([
  "express",
  "flask",
  "vercel",
  "jinja2",
  "jwt",
  "shadcnui",
  "radixui",
  "tanstackstart",
  "prisma",
]);

/** Whether a technology's logo is black and needs inverting on a dark background */
export function isDarkLogo(tech: string): boolean {
  const k = key(tech);
  return DARK_LOGOS.has(k) || DARK_LOGOS.has(ALIASES[k] ?? "");
}

/** The icon for a technology name, or undefined when there is none */
export function techIcon(tech: string): string | undefined {
  const k = key(tech);
  return ICONS[k] ?? ICONS[ALIASES[k] ?? ""];
}
