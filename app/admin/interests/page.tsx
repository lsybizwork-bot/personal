"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { Lang } from "@/lib/db/types";

const LANGS: Lang[] = ["ko", "ja", "zh"];
const LANG_LABEL: Record<Lang, string> = { ko: "한국어", ja: "日本語", zh: "中文" };

export default function AdminInterestsPage() {
  const [tab, setTab] = useState<Lang>("ko");
  const [likes, setLikes] = useState("");
  const [dislikes, setDislikes] = useState("");
  const [saved, setSaved] = useState(false);

  async function load(lang: Lang) {
    const { data } = await supabase.from("interests").select("*").eq("lang", lang).single();
    setLikes((data?.likes || []).join("\n"));
    setDislikes((data?.dislikes || []).join("\n"));
  }

  useEffect(() => { load(tab); }, [tab]);

  async function save() {
    await supabase.from("interests").upsert({
      lang: tab,
      likes: likes.split("\n").map(s => s.trim()).filter(Boolean),
      dislikes: dislikes.split("\n").map(s => s.trim()).filter(Boolean),
    }, { onConflict: "lang" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          <button key={l} style={{ ...s.tab, ...(l === tab ? s.activeTab : {}) }} onClick={() => setTab(l)}>{LANG_LABEL[l]}</button>
        ))}
      </div>
      <div style={s.form}>
        <label style={s.field}>
          <span style={s.lbl}>관심사 (한 줄에 하나)</span>
          <textarea style={{ ...s.input, minHeight: "160px", resize: "vertical" }} value={likes} onChange={e => setLikes(e.target.value)} />
        </label>
        <label style={s.field}>
          <span style={s.lbl}>관심 없는 것 (한 줄에 하나)</span>
          <textarea style={{ ...s.input, minHeight: "120px", resize: "vertical" }} value={dislikes} onChange={e => setDislikes(e.target.value)} />
        </label>
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
  form: { maxWidth: "640px", padding: "32px 40px", display: "flex", flexDirection: "column", gap: "24px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  lbl: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6 },
  input: { padding: "10px 12px", border: "1px solid #ddd", fontSize: "0.9rem", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
};
