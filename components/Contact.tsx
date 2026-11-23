import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { getContent } from "@/content";
import { site } from "@/content/site";
import type { Lang } from "@/content/types";
import { LangSwitch, Menu } from "./Menu";

async function getContactInfo() {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false } }
    );
    const { data } = await sb
      .from("profiles")
      .select("contact_email,contact_kakao,contact_line,contact_wechat")
      .eq("lang", "ko")
      .single();
    return {
      email:  data?.contact_email  || site.contact.email  || "",
      kakao:  data?.contact_kakao  || site.contact.kakao  || "",
      line:   data?.contact_line   || "",
      wechat: data?.contact_wechat || "",
    };
  } catch {
    return {
      email:  site.contact.email  || "",
      kakao:  site.contact.kakao  || "",
      line:   "",
      wechat: "",
    };
  }
}

/** 모든 페이지 하단의 Contact 블록 */
export async function Contact({ lang, path = "", number }: { lang: Lang; path?: string; number?: string }) {
  const { profile } = getContent(lang);
  const contact = await getContactInfo();

  const buttons: { label: string; href: string }[] = [];
  if (contact.kakao)  buttons.push({ label: profile.contact.kakaoLabel, href: contact.kakao });
  if (contact.email)  buttons.push({ label: profile.contact.emailLabel, href: `mailto:${contact.email}` });
  if (contact.line)   buttons.push({ label: "LINE", href: contact.line });
  if (contact.wechat) buttons.push({ label: "WeChat", href: contact.wechat.startsWith("http") ? contact.wechat : `weixin://dl/chat?${contact.wechat}` });

  // site.ts links fallback
  const extraLinks = site.contact.links.filter(
    (l) => !buttons.some((b) => b.href === l.url)
  );

  return (
    <footer id="contact" className="ft">
      <span className="kick">{number ? `${number} — Contact` : "Contact"}</span>
      <h2>{profile.contact.message}</h2>
      {(buttons.length > 0 || extraLinks.length > 0) && (
        <ul className="ft-links">
          {buttons.map((b) => (
            <li key={b.href}>
              <a className="btn" href={b.href} target={b.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer">
                {b.label}
              </a>
            </li>
          ))}
          {extraLinks.map((l) => (
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
