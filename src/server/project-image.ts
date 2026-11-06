/**
 * Server-only: turns a project screenshot stored in the DB (a base64 data URL) into an HTTP
 * response. Used by the /api/project-image/$id route; kept out of public-data.ts so the
 * database driver never ends up in the browser bundle.
 */
import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not configured");
  return neon(url);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATA_URL = /^data:(image\/(?:png|jpe?g|webp|gif|avif));base64,(.+)$/is;

/** Look up one stored screenshot and turn it into an HTTP response. */
export async function projectImageResponse(id: string, kind: string | null): Promise<Response> {
  if (!UUID.test(id)) return new Response("Not found", { status: 404 });

  let stored: string | null | undefined;
  try {
    const sql = getDb();
    const rows =
      kind === "proof"
        ? await sql`SELECT proof_image_url AS src FROM projects WHERE id = ${id} AND is_active = true`
        : await sql`SELECT image_url AS src FROM projects WHERE id = ${id} AND is_active = true`;
    stored = rows[0]?.src as string | null | undefined;
  } catch (err) {
    console.error("[project-image] lookup failed:", err);
    return new Response("Unavailable", { status: 503 });
  }

  if (!stored) return new Response("Not found", { status: 404 });

  // Images saved as a link elsewhere: send the browser there.
  if (/^https:\/\//i.test(stored)) {
    return new Response(null, { status: 302, headers: { Location: stored } });
  }

  // Only raster images are served, so a stored SVG can never run script on this origin.
  const match = DATA_URL.exec(stored);
  if (!match) return new Response("Not found", { status: 404 });

  const bytes = Uint8Array.from(Buffer.from(match[2], "base64"));
  return new Response(bytes, {
    headers: {
      "Content-Type": match[1].toLowerCase().replace("image/jpg", "image/jpeg"),
      // The URL carries a version that changes on every edit, so the bytes behind it never change.
      // s-maxage lets the Vercel CDN keep it too, so the database is hit once per image version.
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
