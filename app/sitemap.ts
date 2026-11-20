import type { MetadataRoute } from "next";
import { getDetailProjects } from "@/content";
import { site } from "@/content/site";
import { LANGS } from "@/content/types";

// content/site.ts 의 siteUrl 을 채우면 사이트맵에 주소가 들어갑니다.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.siteUrl) return [];
  const base = site.siteUrl.replace(/\/$/, "");
  return LANGS.flatMap((lang) => [
    { url: `${base}/${lang}` },
    { url: `${base}/${lang}/life` },
    ...getDetailProjects(lang).map((p) => ({ url: `${base}/${lang}/projects/${p.slug}` })),
  ]);
}
