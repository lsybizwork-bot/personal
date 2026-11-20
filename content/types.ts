// 콘텐츠 파일의 형식 정의 — 내용을 고칠 때는 이 파일을 건드릴 필요가 없습니다.

export const LANGS = ["ko", "ja", "zh"] as const;
export type Lang = (typeof LANGS)[number];

/** 언어 전환 버튼에 보이는 이름과 html lang 값 */
export const LANG_INFO: Record<Lang, { label: string; htmlLang: string }> = {
  ko: { label: "한국어", htmlLang: "ko" },
  ja: { label: "日本語", htmlLang: "ja" },
  zh: { label: "中文", htmlLang: "zh-Hans" },
};

export type Profile = {
  siteName: string;
  description: string;
  hero: { kicker: string; title: string; lead: string; buttonLabel: string };
  about: { title: string; paragraphs: string[] };
  contact: { message: string; kakaoLabel: string; emailLabel: string };
  ui: {
    skip: string;
    countUnit: string;
    projectsTitle: string;
    backToProjects: string;
    lifeTitle: string;
    lifeDescription: string;
    lifeEmpty: string;
  };
};

export type Career = {
  current: { label: string; title: string };
  pastLabel: string;
  past: { field: string; role: string }[];
  otherLabel: string;
  other: { field: string; role: string }[];
  extraLines?: string[];
  credentialsLabel: string;
  credentials: { title: string; items: { name: string; note?: string }[] }[];
};

export type Project = {
  title: string;
  slug?: string;
  year?: string;
  cover?: string;
  description?: string[];
  images?: { src: string; alt?: string; caption?: string }[];
  links?: { label: string; url: string }[];
};

export type ProjectGroup = { field: string; summary: string; hideCount?: boolean; projects: Project[] };

export type Interests = {
  title: string;
  likes: { title: string; detail: string }[];
  dislikesLabel: string;
  dislikes: string[];
};
