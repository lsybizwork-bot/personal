import Link from "next/link";
import { getContent } from "@/content";
import { LANGS, LANG_INFO, type Lang } from "@/content/types";

export function Menu({ lang, label = "Menu" }: { lang: Lang; label?: string }) {
  const items = [
    { href: `/${lang}#about`, label: "About" },
    { href: `/${lang}#career`, label: "Career" },
    { href: `/${lang}#projects`, label: "Projects" },
    { href: `/${lang}#interests`, label: "Interests" },
    { href: `/${lang}/life`, label: "Life" },
    { href: `/${lang}#contact`, label: "Contact" },
  ];
  return (
    <nav aria-label={label}>
      <ul className="menu kick">
        {items.map((m) => (
          <li key={m.href}>
            <Link href={m.href}>{m.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** 언어 전환 — path 는 현재 페이지의 언어 뒤 경로 (예: "/life") */
export function LangSwitch({ lang, path = "" }: { lang: Lang; path?: string }) {
  return (
    <nav aria-label="Language">
      <ul className="langs">
        {LANGS.map((l) => (
          <li key={l}>
            <Link
              href={`/${l}${path}`}
              lang={LANG_INFO[l].htmlLang}
              hrefLang={LANG_INFO[l].htmlLang}
              aria-current={l === lang ? "true" : undefined}
            >
              {LANG_INFO[l].label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** 하위 페이지(일상, 프로젝트 상세)용 상단 바 */
export function TopBar({ lang, path }: { lang: Lang; path: string }) {
  const { profile } = getContent(lang);
  return (
    <header className="bar">
      <Link className="brand" href={`/${lang}`}>
        {profile.siteName}
      </Link>
      <Menu lang={lang} />
      <LangSwitch lang={lang} path={path} />
    </header>
  );
}
