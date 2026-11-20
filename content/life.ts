// 일상 기록 — 사진과 짧은 글 (/life 페이지)
//
// 사진은 public/assets/life 폴더에 넣습니다.
// 아래 entries 에 한 묶음씩 추가하면 적은 순서대로 나옵니다. (새 글은 맨 위에 추가)
// 글은 한국어·일본어·중국어 세 가지로 적습니다.
//
// 예시:
//   {
//     image: "/assets/life/2026-10-jeju.jpg",
//     date: "2026.10",   // 선택 사항
//     alt:   { ko: "사진 설명", ja: "写真の説明", zh: "照片说明" },
//     title: { ko: "제목", ja: "タイトル", zh: "标题" },
//     text:  { ko: "짧은 글", ja: "短い文章", zh: "简短文字" },
//   },

import type { Lang } from "./types";

type Localized = Record<Lang, string>;

export type LifeEntry = {
  image: string;
  date?: string;
  alt: Localized;
  title: Localized;
  text: Localized;
};

export const lifeEntries: LifeEntry[] = [];
