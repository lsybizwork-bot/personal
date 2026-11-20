// [中文] 经历 · 其他经历 · 学历/资格/获奖
import type { Career } from "../types";

export const career: Career = {
  current: {
    label: "现在",
    title: "仁川西海区文化财团 文化政策组组长",
  },

  pastLabel: "过往经历",
  past: [
    { field: "文化艺术行政", role: "仁川地区文化财团 文化艺术行政（生活文化、策划、经营等）" },
    { field: "文化艺术行政", role: "忠清南道地区文化财团 文化艺术行政（展览、教育）" },
    { field: "大学行政", role: "京畿地区私立大学 教务行政" },
    { field: "文化设施", role: "国家遗产相关文化设施 运营" },
  ],

  otherLabel: "其他经历",
  other: [],

  credentialsLabel: "学历 · 资格 · 获奖",
  credentials: [
    {
      title: "学历",
      items: [{ name: "文化艺术经营 硕士" }, { name: "美术学部（韩国画）学士" }],
    },
    {
      title: "资格与语言",
      items: [{ name: "日本语能力考试 JLPT 1级" }, { name: "艺术教育师" }, { name: "终身教育师" }, { name: "社会福利师" }],
    },
    {
      title: "获奖",
      items: [{ name: "风险企业部长官奖", note: "企业家精神财团 / 企业家精神挑战赛 入选作品 · 改善工作不便的平台" }],
    },
  ],
};
