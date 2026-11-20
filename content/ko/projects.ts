// [한국어] 전문 분야와 프로젝트
// 화면에는 분야 이름과 한 줄 설명(summary)만 보이고, 누르면 그 분야의 프로젝트가 펼쳐집니다.
//
// 프로젝트 추가: 해당 분야의 projects 안에 { title: "프로젝트명" }, 한 줄을 넣습니다.
// 프로젝트 삭제: 그 줄을 지웁니다.
// 분야 추가: { field: "분야명", summary: "한 줄 설명", projects: [ ... ] } 묶음을 하나 더 만듭니다.
//   (건수를 숨기려면 hideCount: true 를 넣습니다.)
// ※ 일본어·중국어 화면에도 반영하려면 content/ja, content/zh 의 같은 파일도 함께 고칩니다.
//
// title 외의 항목은 모두 선택 사항이며, 비워 두면 화면에 나오지 않습니다.
//   slug        상세 페이지 주소(영문·숫자·하이픈). 넣으면 상세 페이지가 생깁니다. 세 언어에 같은 값을 씁니다.
//   year        연도 (상세 페이지에만 표시)
//   cover       대표 이미지. public/assets/projects 폴더에 넣고 "/assets/projects/파일명.jpg"
//   description 프로젝트 설명 (문단마다 한 줄)
//   images      관련 사진 목록 — caption 에 사진 설명을 적으면 사진 아래에 나옵니다.
//   links       관련 링크 목록
//
// 예시:
//   {
//     title: "「비전2030」 수립",
//     slug: "vision-2030",
//     year: "2026",
//     cover: "/assets/projects/vision-2030.jpg",
//     description: ["첫 문단", "둘째 문단"],
//     images: [{ src: "/assets/projects/vision-2030-1.jpg", alt: "사진 내용", caption: "사진 아래 설명" }],
//     links: [{ label: "관련 기사", url: "https://..." }],
//   },
import type { ProjectGroup } from "../types";

export const projectGroups: ProjectGroup[] = [
  {
    field: "문화정책 · 경영",
    summary: "지역문화 정책, 중장기 발전계획, 기관 비전 수립, 포럼, 조직·예산·성과 관리, 이사회 운영",
    projects: [
      { title: "지역문화정책 「문화브리프」 발간" },
      { title: "「비전2030」 수립" },
      { title: "문화예술포럼" },
      { title: "문화비전 포럼" },
      { title: "지역문화컨설팅 지원사업" },
      { title: "AI 기반 법령·행정정보 지원 챗봇 구축" },
      { title: "윤리경영" },
      { title: "이사회 운영" },
      { title: "예산관리" },
      { title: "업무협약" },
      { title: "반부패 시책 추진" },
      { title: "사회적가치 추진" },
      { title: "직원역량강화 지역탐방" },
    ],
  },
  {
    field: "전시 · 공연 · 축제",
    summary: "전시, 공연, 축제 기획 및 운영, 예술단 운영",
    projects: [
      { title: "국가산단 지역 특화전시 「작자미상의 단편선」" },
      { title: "검여 유희강 K-Culture 프로젝트" },
      { title: "올해의작가전" },
      { title: "이시대의작가전" },
      { title: "김경인초대전" },
      { title: "모래랑빛이랑" },
      { title: "미술은행 소장품전" },
      { title: "문화의거리가을 축제" },
      { title: "청소년 음악제" },
      { title: "구립 예술단 운영" },
      { title: "찾아가는 공연 「노을마당」" },
      { title: "문화가 있는 날 어린이음악회" },
      { title: "문화가 있는 날 공연산책" },
      { title: "청라커낼웨이 아트마켓" },
      { title: "아트프리마켓" },
    ],
  },
  {
    field: "교육 · 생활문화 · 지원",
    summary: "문화예술교육, 생활문화센터 운영, 청년예술가 지원",
    projects: [
      { title: "문화대학 운영" },
      { title: "예술교육프로그램 「꿈꾸는 발레리나」" },
      { title: "예술교육프로그램 「몸짓손짓두둠칫」" },
      { title: "문화예술교육사 실습처 운영" },
      { title: "가족오케스트라" },
      { title: "문화예술학교 운영" },
      { title: "문화예술교육특강 「설화그림자극」" },
      { title: "인문학포럼지원사업" },
      { title: "시민 한책읽기 운동" },
      { title: "생활문화센터 상설체험 프로그램" },
      { title: "생활문화센터 동호회 창출프로그램" },
      { title: "생활문화센터 연계 프로그램" },
      { title: "생활문화센터 운영위원회" },
      { title: "문화동아리역량강화사업" },
      { title: "동아리주간" },
      { title: "서포터즈 운영" },
      { title: "안티코로나 청년일자리 지원사업" },
      { title: "청년예술가활동지원사업" },
      { title: "연수단원지원사업" },
      { title: "청년기획단 운영" },
      { title: "예술단체간담회 및 사업설명회" },
    ],
  },
  {
    field: "바이브 코딩",
    summary: "코딩, 영상, 이미지, 홈페이지, 게임, 플랫폼 제작",
    projects: [
      { title: "검여 유희강 50주년 기념 아카이브" },
      { title: "검여 유희강 게임 「검여의 서실」" },
      { title: "검여 유희강 게임 「관서악부」" },
      { title: "검여 유희강 게임 「되살아나는 세상」" },
      { title: "문화브리프 지면 및 숏츠" },
      { title: "수강신청 접수 시스템" },
      { title: "AI 기반 법령·행정정보 지원 챗봇" },
    ],
  },
  {
    field: "해외 기업 컨설팅 · 통역",
    summary: "해외 기업의 한국 시장 진출 컨설팅(시장조사, 유통·상품기획(MD), 홍보·마케팅) 및 비즈니스 통역",
    hideCount: true,
    projects: [
      { title: "시장조사" },
      { title: "유통 · 상품기획(MD)" },
      { title: "홍보 · 마케팅" },
      { title: "비즈니스 통역" },
    ],
  },
];
