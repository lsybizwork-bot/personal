"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { Lang } from "@/lib/db/types";

const LANGS: Lang[] = ["ko", "ja", "zh"];
const LANG_LABEL: Record<Lang, string> = { ko: "한국어", ja: "日本語", zh: "中文" };

interface LikeItem { title: string; detail: string; }

export default function AdminInterestsPage() {
  const [tab, setTab] = useState<Lang>("ko");
  const [likes, setLikes] = useState<LikeItem[]>([]);
  const [dislikes, setDislikes] = useState("");
  const [saved, setSaved] = useState(false);

  async function load(lang: Lang) {
    const { data } = await supabase.from("interests").select("*").eq("lang", lang).single();
    if (!data) { setLikes([]); setDislikes(""); return; }
    // likes: jsonb — [{title, detail}] 또는 [string]
    const rawLikes = data.likes || [];
    const parsed: LikeItem[] = rawLikes.map((x: LikeItem | string) =>
      typeof x === "string" ? { title: x, detail: "" } : { title: x.title || "", detail: x.detail || "" }
    );
    setLikes(parsed);
    // dislikes: jsonb — [string]
    const rawDislikes = data.dislikes || [];
    setDislikes(rawDislikes.map((x: string | Record<string, string>) => typeof x === "string" ? x : (x.title || "")).join("\n"));
  }

  useEffect(() => { load(tab); }, [tab]);

  async function save() {
    const likesJson = likes.filter(x => x.title.trim());
    const dislikesArr = dislikes.split("\n").map(s => s.trim()).filter(Boolean);
    await supabase.from("interests").upsert(
      { lang: tab, likes: likesJson, dislikes: dislikesArr },
      { onConflict: "lang" }
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addLike() { setLikes(p => [...p, { title: "", detail: "" }]); }
  function removeLike(i: number) { setLikes(p => p.filter((_, j) => j !== i)); }
  function updateLike(i: number, field: keyof LikeItem, v: string) {
    setLikes(p => p.map((x, j) => j !== i ? x : { ...x, [field]: v }));
  }

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <Link href="/admin" style={s.back}>← Admin</Link>
        <h1 style={s.h1}>Interests</h1>
        <button style={s.btn} onClick={save}>{saved ? "저장됨 ✓" : "저장"}</button>
      </header>
      <div style={s.tabs}>
        {LANGS.map(l => (
          <button key={l} style={{ ...s.tab, ...(l === tab ? s.activeTab : {}) }} onClick={() => setTab(l)}>
            {LANG_LABEL[l]}
          </button>
        ))}
      </div>
      <div style={s.form}>

        {/* 좋아하는 것들 */}
        <div style={s.section}>
          <div style={s.secRow}>
            <h2 style={s.sectionH}>좋아하는 것들</h2>
            <button style={s.addBtn} onClick={addLike}>+ 추가</button>
          </div>
          <div style={s.colHeader}>
            <span style={{ ...s.colLbl, flex: "0 0 160px" }}>제목</span>
            <span style={{ ...s.colLbl, flex: 1 }}>상세 내용</span>
          </div>
          {likes.map((item, i) => (
            <div key={i} style={s.likeRow}>
              <input style={{ ...s.input, flex: "0 0 160px" }} placeholder="제목" value={item.title} onChange={e => updateLike(i, "title", e.target.value)} />
              <input style={{ ...s.input, flex: 1 }} placeholder="상세 내용 (예: 반도체, AI, 자율주행)" value={item.detail} onChange={e => updateLike(i, "detail", e.target.value)} />
              <button style={s.rmBtn} onClick={() => removeLike(i)}>×</button>
            </div>
          ))}
          {likes.length === 0 && <p style={s.hint}>항목을 추가하세요.</p>}
        </div>

        {/* 싫어하는 것들 */}
        <div style={s.section}>
          <h2 style={s.sectionH}>싫어하는 것들 (한 줄에 하나)</h2>
          <textarea
            style={{ ...s.input, minHeight: "140px", resize: "vertical" }}
            value={dislikes}
            onChange={e => setDislikes(e.target.value)}
            placeholder={"낮은 윤리의식\n근태 불량\n..."}
          />
        </div>

      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", background: "#f9f7f4", fontFamily: "system-ui, sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "16px", padding: "20px 40px", borderBottom: "1px solid #e0dbd4", background: "#fff" },
  back: { color: "#666", textDecoration: "none", fontSize: "0.85rem" },
  h1: { fontFamily: "Georgia, serif", fontSize: "1.4rem", fontWeight: 400, flex: 1 },
  btn: { padding: "8px 20px", background: "#1a1714", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.8rem" },
  tabs: { display: "flex", padding: "0 40px", borderBottom: "1px solid #e0dbd4", background: "#fff" },
  tab: { padding: "12px 20px", border: "none", background: "none", cursor: "pointer", fontSize: "0.85rem", borderBottom: "2px solid transparent" },
  activeTab: { borderBottomColor: "#1a1714", fontWeight: 600 },
  form: { maxWidth: "680px", padding: "32px 40px", display: "flex", flexDirection: "column", gap: "32px" },
  section: { display: "flex", flexDirection: "column", gap: "8px" },
  secRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  sectionH: { fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6 },
  colHeader: { display: "flex", gap: "8px", padding: "0 2px" },
  colLbl: { fontSize: "0.72rem", fontWeight: 600, opacity: 0.45, letterSpacing: "0.07em", textTransform: "uppercase" },
  likeRow: { display: "flex", gap: "8px", alignItems: "center" },
  input: { padding: "9px 12px", border: "1px solid #ddd", fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box" as const },
  addBtn: { padding: "5px 12px", border: "1px solid #ccc", background: "none", cursor: "pointer", fontSize: "0.8rem" },
  rmBtn: { padding: "6px 10px", border: "1px solid #ecc", background: "none", color: "#c00", cursor: "pointer", flexShrink: 0 },
  hint: { fontSize: "0.8rem", opacity: 0.4 },
};
