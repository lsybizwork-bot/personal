import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { TopBar } from "@/components/Menu";
import { getContent, getDetailProjects, isLang } from "@/content";
import { LANGS } from "@/content/types";

type Props = { params: Promise<{ lang: string; slug: string }> };

async function load(params: Props["params"]) {
  const { lang, slug } = await params;
  if (!isLang(lang)) return null;
  const project = getDetailProjects(lang).find((p) => p.slug === decodeURIComponent(slug));
  return project ? { lang, project } : null;
}

export function generateStaticParams() {
  return LANGS.flatMap((lang) => getDetailProjects(lang).map((p) => ({ lang, slug: p.slug! })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(params);
  if (!found) return {};
  const { lang, project } = found;
  return {
    title: project.title,
    description: project.description?.[0],
    alternates: { canonical: `/${lang}/projects/${project.slug}` },
    openGraph: project.cover ? { images: [project.cover] } : undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const found = await load(params);
  if (!found) notFound();
  const { lang, project } = found;
  const { ui } = getContent(lang).profile;
  const path = `/projects/${project.slug}`;

  return (
    <>
      <TopBar lang={lang} path={path} />
      <main id="main">
        <div className="page-hd">
          <span className="kick">{project.field}</span>
          <h1>{project.title}</h1>
          {project.year && <p className="meta">{project.year}</p>}
        </div>

        <article className="detail">
          {project.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="cover" src={project.cover} alt="" />
          )}
          {project.description && project.description.length > 0 && (
            <div className="prose">
              {project.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          )}
          {project.images && project.images.length > 0 && (
            <div className="gallery">
              {project.images.map((img) => (
                <figure key={img.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt ?? ""} loading="lazy" />
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
          {project.links && project.links.length > 0 && (
            <ul className="links">
              {project.links.map((l) => (
                <li key={l.url}>
                  <a className="btn" href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="backrow">
            <Link className="back" href={`/${lang}#projects`}>
              {ui.backToProjects}
            </Link>
          </p>
        </article>
        <div className="sp" />
      </main>
      <Contact lang={lang} path={path} />
    </>
  );
}
