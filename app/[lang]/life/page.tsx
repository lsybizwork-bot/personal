import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { TopBar } from "@/components/Menu";
import { getContent, isLang } from "@/content";
import type { Lang } from "@/lib/db/types";

type Props = { params: Promise<{ lang: string }> };

async function getLifeEntries() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/life_entries?select=*&order=sort_order.asc,created_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const { ui } = getContent(lang).profile;
  return { title: ui.lifeTitle, description: ui.lifeDescription, alternates: { canonical: `/${lang}/life` } };
}

export default async function LifePage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const { ui } = getContent(lang).profile;

  const entries = await getLifeEntries();
  const l = lang as Lang;

  return (
    <>
      <TopBar lang={lang} path="/life" />
      <main id="main">
        <div className="page-hd">
          <span className="kick">Life</span>
          <h1>{ui.lifeTitle}</h1>
          <p className="meta">{ui.lifeDescription}</p>
        </div>

        {entries.length === 0 ? (
          <p className="empty">{ui.lifeEmpty}</p>
        ) : (
          <ul className="life">
            {entries.map((e: Record<string, string>) => (
              <li key={e.id}>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.image_url} alt={e[`alt_${l}`] || ""} loading="lazy" />
                </figure>
                <div>
                  {e.date && <time>{e.date}</time>}
                  {e[`title_${l}`] && <h2>{e[`title_${l}`]}</h2>}
                  {e[`text_${l}`] && <p>{e[`text_${l}`]}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="sp" />
      </main>
      <Contact lang={lang} path="/life" />
    </>
  );
}
