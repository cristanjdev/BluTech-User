/**
 * Server functions that read admin-managed content from the shared Neon DB.
 *
 * The tables are created and migrated by the admin app; this site only reads them.
 * Project screenshots are stored in the DB as base64 data URLs (several MB in total), so they
 * are never sent with the project list. The list carries a short URL instead, served by
 * `/api/project-image/$id`, which the browser loads lazily and caches.
 */
import { createServerFn } from "@tanstack/react-start";
import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not configured");
  return neon(url);
}

export interface ServiceRow {
  id: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  sort_order: number;
}

export interface ProjectRow {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  about: string;
  stack: string[];
  gradient: string;
  meta: string;
  is_featured: boolean;
  /** URL of the project screenshot, or null when there is none */
  image_url: string | null;
  /** URL of the proof-of-transaction screenshot, or null when there is none */
  proof_image_url: string | null;
  client_number: string;
  service_type: string;
  transaction_date: string;
}

export interface HomeData {
  services: ServiceRow[];
  projects: ProjectRow[];
}

/** Build the image URL; the version changes whenever the project is edited, so the image can be cached forever. */
export function projectImagePath(id: string, kind: "image" | "proof", version: number) {
  const base = `/api/project-image/${id}`;
  return kind === "proof" ? `${base}?kind=proof&v=${version}` : `${base}?v=${version}`;
}

/**
 * Everything the home page needs, in one round trip. Returns null when the database is
 * unavailable so the page can still render its built-in content.
 */
export const fetchHomeData = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomeData | null> => {
    try {
      const sql = getDb();
      const [services, projects] = await Promise.all([
        sql`
          SELECT id, icon, title, description, tags, sort_order
          FROM services WHERE is_active = true ORDER BY sort_order ASC
        `,
        sql`
          SELECT id, title, category, year, description, about, stack, gradient, meta, is_featured,
                 image_url IS NOT NULL AND image_url <> '' AS has_image,
                 proof_image_url IS NOT NULL AND proof_image_url <> '' AS has_proof,
                 client_number, service_type, transaction_date,
                 floor(extract(epoch FROM updated_at))::bigint AS version
          FROM projects WHERE is_active = true
          ORDER BY sort_order ASC, created_at DESC
        `,
      ]);

      return {
        services: services as ServiceRow[],
        projects: projects.map((r) => {
          const version = Number(r.version);
          return {
            id: r.id,
            title: r.title,
            category: r.category,
            year: r.year,
            description: r.description,
            about: r.about,
            stack: r.stack,
            gradient: r.gradient,
            meta: r.meta,
            is_featured: r.is_featured,
            image_url: r.has_image ? projectImagePath(r.id, "image", version) : null,
            proof_image_url: r.has_proof ? projectImagePath(r.id, "proof", version) : null,
            client_number: r.client_number,
            service_type: r.service_type,
            transaction_date: r.transaction_date,
          } satisfies ProjectRow;
        }),
      };
    } catch (err) {
      console.error("[fetchHomeData] Failed to load content:", err);
      return null;
    }
  },
);
