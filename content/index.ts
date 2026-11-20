// 언어별 콘텐츠를 한데 모으는 파일 — 내용을 고칠 때는 건드릴 필요가 없습니다.
import { career as careerJa } from "./ja/career";
import { interests as interestsJa } from "./ja/interests";
import { profile as profileJa } from "./ja/profile";
import { projectGroups as projectsJa } from "./ja/projects";
import { career as careerKo } from "./ko/career";
import { interests as interestsKo } from "./ko/interests";
import { profile as profileKo } from "./ko/profile";
import { projectGroups as projectsKo } from "./ko/projects";
import { LANGS, type Lang } from "./types";
import { career as careerZh } from "./zh/career";
import { interests as interestsZh } from "./zh/interests";
import { profile as profileZh } from "./zh/profile";
import { projectGroups as projectsZh } from "./zh/projects";

const all = {
  ko: { profile: profileKo, career: careerKo, projectGroups: projectsKo, interests: interestsKo },
  ja: { profile: profileJa, career: careerJa, projectGroups: projectsJa, interests: interestsJa },
  zh: { profile: profileZh, career: careerZh, projectGroups: projectsZh, interests: interestsZh },
};

export function getContent(lang: Lang) {
  return all[lang];
}

/** 상세 페이지가 있는(slug를 넣은) 프로젝트 목록 */
export function getDetailProjects(lang: Lang) {
  return all[lang].projectGroups.flatMap((g) =>
    g.projects.filter((p) => p.slug).map((p) => ({ ...p, field: g.field })),
  );
}

export const isLang = (value: string): value is Lang => (LANGS as readonly string[]).includes(value);
