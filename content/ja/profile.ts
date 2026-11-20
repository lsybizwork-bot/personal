// [日本語] 基本プロフィール · 最初の画面 · 私の物語 · 連絡の文言
import type { Profile } from "../types";

export const profile: Profile = {
  siteName: "私を知っていく記録",
  description: "これまでの経験と考え、関心事と新しい挑戦をひとつずつ綴っていく個人アーカイブです。",

  hero: {
    kicker: "Professional Personal Archive",
    title: "私を知っていく記録",
    lead: "経験と考え、関心事と新しい挑戦をひとつずつ綴ります。",
    buttonLabel: "記録を読む",
  },

  about: {
    title: "私の物語",
    paragraphs: [
      "人と人が通じ合うためには、お互いを知っていく過程が必要です。",
      "ところが、いざ自分を紹介しようとすると、何を話せばよいのか途方に暮れました。",
      "そこで、自分を知っていく記録を始めました。",
      "これまでの人生を振り返り、経験と考え、関心事と新しい挑戦をひとつずつ綴っていこうと思います。",
      "過去を振り返り、これからの人生を描いていくきっかけにします。",
      "そして、多くの対話の出発点になることを願って、このページを作ります。",
    ],
  },

  contact: {
    message: "この記録が、多くの対話の出発点になることを願っています。",
    kakaoLabel: "カカオトークで連絡する",
    emailLabel: "メールを送る",
  },

  ui: {
    skip: "本文へスキップ",
    countUnit: "件",
    projectsTitle: "専門分野とプロジェクト",
    backToProjects: "← プロジェクト一覧",
    lifeTitle: "日常",
    lifeDescription: "写真と短い文章で残す日常の記録です。",
    lifeEmpty: "まだ記録がありません。",
  },
};
