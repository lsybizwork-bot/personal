// [日本語] 経歴 · その他の経験 · 学歴/資格/受賞
import type { Career } from "../types";

export const career: Career = {
  current: {
    label: "現在",
    title: "仁川西海区文化財団 文化政策チーム長",
  },

  pastLabel: "これまでの経歴",
  past: [
    { field: "文化芸術行政", role: "仁川圏の文化財団 文化芸術行政(生活文化・企画・経営など)" },
    { field: "文化芸術行政", role: "忠清南道圏の文化財団 文化芸術行政(展示・教育)" },
    { field: "大学行政", role: "京畿圏の私立大学 教務行政" },
    { field: "文化施設", role: "国家遺産関連の文化施設 運営" },
  ],

  otherLabel: "その他の経験",
  other: [],

  credentialsLabel: "学歴 · 資格 · 受賞",
  credentials: [
    {
      title: "学歴",
      items: [{ name: "文化芸術経営 修士" }, { name: "美術学部(韓国画) 学士" }],
    },
    {
      title: "資格・語学",
      items: [{ name: "日本語能力試験 JLPT 1級" }, { name: "芸術教育士" }, { name: "生涯教育士" }, { name: "社会福祉士" }],
    },
    {
      title: "受賞",
      items: [{ name: "ベンチャー部長官賞", note: "起業家精神財団 / 起業家精神チャレンジ 選定作 · 業務の不便を改善したプラットフォーム" }],
    },
  ],
};
