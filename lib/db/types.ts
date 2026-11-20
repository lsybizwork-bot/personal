export type Lang = "ko" | "ja" | "zh";

export interface ProfileRow {
  id: number;
  lang: Lang;
  site_name: string | null;
  hero_title: string | null;
  hero_desc: string | null;
  about_first: string | null;
  about_body: string | null;
  updated_at: string;
}

export interface CareerRow {
  id: number;
  lang: Lang;
  current_title: string | null;
  current_org: string | null;
  skills: string[] | null;
}

export interface CareerEntryRow {
  id: number;
  lang: Lang;
  section: string;
  period: string | null;
  title: string | null;
  sort_order: number;
}

export interface ProjectRow {
  id: number;
  slug: string;
  sort_order: number;
}

export interface ProjectTranslationRow {
  id: number;
  project_id: number;
  lang: Lang;
  group_name: string | null;
  title: string | null;
  summary: string | null;
  url: string | null;
}

export interface InterestRow {
  id: number;
  lang: Lang;
  likes: string[];
  dislikes: string[];
}

export interface LifeEntryRow {
  id: number;
  image_url: string;
  date: string | null;
  sort_order: number;
  title_ko: string | null;
  title_ja: string | null;
  title_zh: string | null;
  text_ko: string | null;
  text_ja: string | null;
  text_zh: string | null;
  alt_ko: string | null;
  alt_ja: string | null;
  alt_zh: string | null;
  created_at: string;
}
