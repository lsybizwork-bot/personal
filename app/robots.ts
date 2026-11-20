import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(site.siteUrl ? { sitemap: `${site.siteUrl.replace(/\/$/, "")}/sitemap.xml` } : {}),
  };
}
