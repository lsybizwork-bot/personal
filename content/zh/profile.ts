// [中文] 基本资料 · 首屏文案 · 我的故事 · 联系文案
import type { Profile } from "../types";

export const profile: Profile = {
  siteName: "认识自己的记录",
  description: "把至今的经历与思考、兴趣与新的挑战一点一点记录下来的个人档案。",

  name: "李昭英",
  age: "1984.05",

  hero: {
    kicker: "Professional Personal Archive",
    title: "认识自己的记录",
    lead: "把经历与思考、兴趣与新的挑战一点一点记录下来。",
    buttonLabel: "阅读记录",
  },

  about: {
    title: "我的故事",
    paragraphs: [
      "人与人之间要沟通，需要一个相互了解的过程。",
      "可是真要介绍自己的时候，却不知道该说些什么。",
      "于是，我开始了这份认识自己的记录。",
      "回顾至今的人生，把经历与思考、兴趣与新的挑战一点一点记录下来。",
      "希望借此回顾过去，描绘今后的人生。",
      "同时，也希望这里能成为更多交流的起点，因此做了这个页面。",
    ],
  },

  contact: {
    message: "愿这份记录成为更多交流的起点。",
    kakaoLabel: "通过 KakaoTalk 联系",
    emailLabel: "发送邮件",
  },

  ui: {
    skip: "跳到正文",
    countUnit: "项",
    projectsTitle: "专业领域与项目",
    backToProjects: "← 项目列表",
    lifeTitle: "日常",
    lifeDescription: "用照片和简短文字留下的日常记录。",
    lifeEmpty: "还没有记录。",
  },
};
