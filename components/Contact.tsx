import Link from "next/link";
import { getContent } from "@/content";
import { site } from "@/content/site";
import type { Lang } from "@/content/types";
import { LangSwitch, Menu } from "./Menu";

/** 모든 페이지 하단의 Contact 블록 */
export function Contact({ lang, path = "", number }: { lang: Lang; path?: string; number?: string }) {
  const { profile } = getContent(lang);
  const { kakao, email, links } = site.contact;
  const hasAny = kakao || email || links.length > 0;

  return (
    <footer id="contact" className="ft">
      <span className="kick">{number ? `${number} — Contact` : "Contact"}</span>
      <h2>{profile.contact.message}</h2>
      {hasAny && (
        <ul className="ft-links">
          {kakao && (
            <li>
              <a className="btn" href={kakao} target="_blank" rel="noopener noreferrer">
                {profile.contact.kakaoLabel}
              </a>
            </li>
          )}
          {email && (
            <li>
              <a className="btn" href={`mailto:${email}`}>
                {profile.contact.emailLabel}
              </a>
            </li>
          )}
          {links.map((l) => (
            <li key={l.url}>
              <a className="btn" href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      <div className="ft-b">
        <Link className="brand" href={`/${lang}`}>
          {profile.siteName}
        </Link>
        <Menu lang={lang} label="Footer menu" />
        <LangSwitch lang={lang} path={path} />
      </div>
    </footer>
  );
}
