import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";

/** Absolute origin of the current request, so canonical and sitemap match the live host. */
export const getSiteOrigin = createServerFn({ method: "GET" }).handler(() => {
  try {
    return getRequestUrl().origin;
  } catch {
    return "";
  }
});
