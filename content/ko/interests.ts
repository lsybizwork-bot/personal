// [한국어] 좋아하는 것들 · 싫어하는 것들 (제목을 누르면 내용이 펼쳐집니다)
import type { Interests } from "../types";

export const interests: Interests = {
  title: "좋아하는 것들",
  likes: [
{ title: "첨단기술", detail: "반도체, 자율주행, 로봇, 하드웨어, IT, AI" },
    { title: "경제", detail: "기업 및 시장 동향, 코스닥" },
    { title: "예술", detail: "전통매듭, 가츠시카 호쿠사이, 김홍도" },
    { title: "해외", detail: "일본어 드라마 자막 제작, 동북아시아(중국, 일본) 트렌드" },
    { title: "건강", detail: "아쿠아로빅, 산책, 파니니" },
  ],
  dislikesLabel: "싫어하는 것들",
  dislikes: ["낮은 윤리의식", "근태 불량", "근력운동", "카페인", "과일", "기름진 음식", "술"],
};
