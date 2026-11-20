// 모든 언어에 공통인 설정 — 사이트 주소와 연락 수단
// 비워 둔 항목은 화면에 나오지 않습니다.

export const site = {
  /** 배포된 실제 주소 (검색엔진용) */
  siteUrl: "https://personal-archive-beta.vercel.app",

  contact: {
    /** 카카오톡 오픈채팅 또는 채널 주소. 예: "https://open.kakao.com/o/abcd1234" */
    kakao: "",
    /** 공개용 이메일. 예: "hello@example.com" */
    email: "",
    /** 그 밖의 SNS·블로그. 예: { label: "Instagram", url: "https://instagram.com/..." } */
    links: [] as { label: string; url: string }[],
  },
};
