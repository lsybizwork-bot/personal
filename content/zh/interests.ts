// [中文] 喜欢的事物 · 不喜欢的事物
import type { Interests } from "../types";

export const interests: Interests = {
  title: "喜欢的事物",
  likes: [
    { title: "AI·数字技术", detail: "运用AI工具进行编程、视频、图像、网站、游戏、平台制作" },
    { title: "尖端技术", detail: "半导体、自动驾驶、机器人、硬件、IT" },
    { title: "经济", detail: "企业与市场动向、股票投资、东北亚（中国、日本）趋势" },
    { title: "艺术", detail: "韩国传统绳结、葛饰北斋、金弘道" },
    { title: "健康", detail: "水中健身操、散步、帕尼尼" },
  ],
  dislikesLabel: "不喜欢的事物",
  dislikes: ["伦理意识低下", "考勤不良", "力量训练", "咖啡因", "水果", "油腻食物", "酒"],
};
