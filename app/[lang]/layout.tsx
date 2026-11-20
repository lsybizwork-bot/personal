import type { Metadata, Viewport } from "next";
import {
  Inter,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_SC,
  Noto_Serif_JP,
  Noto_Serif_KR,
  Noto_Serif_SC,
  Playfair_Display,
} from "next/font/google";
import { notFound } from "next/navigation";
import { getContent, isLang } from "@/content";
import { site } from "@/content/site";
import { LANGS, LANG_INFO, type Lang } from "@/content/types";
import "../globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-playfair", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-inter", display: "swap" });

const serifKr = Noto_Serif_KR({ weight: ["400", "500"], display: "swap", preload: false, variable: "--f-serif-cjk" });
const sansKr = Noto_Sans_KR({ weight: ["400", "500"], display: "swap", preload: false, variable: "--f-sans-cjk" });
const serifJp = Noto_Serif_JP({ weight: ["400", "500"], display: "swap", preload: false, variable: "--f-serif-cjk" });
const sansJp = Noto_Sans_JP({ weight: ["400", "500"], display: "swap", preload: false, variable: "--f-sans-cjk" });
const serifSc = Noto_Serif_SC({ weight: ["400", "500"], display: "swap", preload: false, variable: "--f-serif-cjk" });
const sansSc = Noto_Sans_SC({ weight: ["400", "500"], display: "swap", preload: false, variable: "--f-sans-cjk" });

const cjkFonts: Record<Lang, string> = {
  ko: `${serifKr.variable} ${sansKr.variable}`,
  ja: `${serifJp.variable} ${sansJp.variable}`,
  zh: `${serifSc.variable} ${sansSc.variable}`,
};

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const { profile } = getContent(lang);
  return {
    ...(site.siteUrl ? { metadataBase: new URL(site.siteUrl) } : {}),
    title: { default: profile.siteName, template: `%s — ${profile.siteName}` },
    description: profile.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(LANGS.map((l) => [LANG_INFO[l].htmlLang, `/${l}`])),
    },
    openGraph: {
      type: "website",
      siteName: profile.siteName,
      title: profile.siteName,
      description: profile.description,
    },
    twitter: { card: "summary", title: profile.siteName, description: profile.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = { themeColor: "#5c1f2e" };

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const { profile } = getContent(lang);

  return (
    <html lang={LANG_INFO[lang].htmlLang} className={`${playfair.variable} ${inter.variable} ${cjkFonts[lang]}`}>
      <body>
        <a className="skip" href="#main">
          {profile.ui.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
