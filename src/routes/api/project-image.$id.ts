import { createFileRoute } from "@tanstack/react-router";

/** Serves a project's screenshot (or, with ?kind=proof, its proof-of-transaction image). */
export const Route = createFileRoute("/api/project-image/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        // Imported inside the handler, which only exists in the server build
        const { projectImageResponse } = await import("@/server/project-image");
        return projectImageResponse(params.id, new URL(request.url).searchParams.get("kind"));
      },
    },
  },
});
