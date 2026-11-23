// [한국어] 경력 · 그 밖의 경험 · 학력/자격/수상
import type { Career } from "../types";

export const career: Career = {
  /** 현재 직책 (항상 펼쳐져 보입니다) */
  current: {
    label: "현재",
    title: "인천서해구문화재단 문화정책팀장",
  },

  /** 이전 경력 (최근 순, 누르면 펼쳐집니다) */
  pastLabel: "경력",
  past: [
    { field: "문화예술행정", role: "인천권 문화재단 문화예술행정 (생활문화·기획·경영 등)" },
    { field: "문화예술행정", role: "충남권 문화재단 문화예술행정 (전시·교육)" },
    { field: "컨설팅", role: "해외 기업 한국 시장 진출 컨설팅" },
    { field: "대학 행정", role: "경기권 사립대학교 교무행정" },
    { field: "문화시설", role: "국가유산 관련 문화시설 운영" },
  ],

  /** 제목만 한 줄로 보여줄 경력 (펼쳐지지 않음). 세부 내용은 projects.ts 의 같은 이름 분야에 있습니다. */
  extraLines: ["해외 기업 컨설팅 · 통역"],

  /** 그 밖의 경험 (누르면 펼쳐짐) — 비워 두면 화면에 나오지 않습니다.
   *  예: { field: "분류", role: "내용" } */
  otherLabel: "그 밖의 경험",
  other: [],

  /** 학력 · 자격 · 수상 (note는 선택 사항) */
  credentialsLabel: "학력 · 자격 · 수상",
  credentials: [
    {
      title: "학력",
      items: [{ name: "문화예술경영 석사" }, { name: "미술학부(한국화) 학사" }],
    },
    {
      title: "자격 및 어학",
      items: [{ name: "일본어능력시험 JLPT 1급" }, { name: "예술교육사" }, { name: "평생교육사" }, { name: "사회복지사" }],
    },
    {
      title: "수상",
      items: [
        { name: "벤처부장관상", note: "기업가정신재단 / 기업가정신챌린지 선정작 · 업무 불편을 개선한 플랫폼" },
        { name: "해외 탐방 장학생", note: "도쿄예술대학 · 공모 선정" },
      ],
    },
  ],
};
