// [日本語] 好きなもの · 苦手なもの
import type { Interests } from "../types";

export const interests: Interests = {
  title: "好きなもの",
  likes: [
    { title: "AI・デジタル技術", detail: "AIツールを活用したコーディング、映像、画像、ホームページ、ゲーム、プラットフォーム制作" },
    { title: "先端技術", detail: "半導体、自動運転、ロボット、ハードウェア、IT" },
    { title: "経済", detail: "企業・市場動向、株式投資、北東アジア(中国・日本)のトレンド" },
    { title: "芸術", detail: "韓国の伝統組紐(メドゥプ)、葛飾北斎、金弘道(キム・ホンド)" },
    { title: "健康", detail: "アクアビクス、散歩、パニーニ" },
  ],
  dislikesLabel: "苦手なもの",
  dislikes: ["低い倫理意識", "勤怠不良", "筋力トレーニング", "カフェイン", "果物", "脂っこい食べ物", "お酒"],
};
