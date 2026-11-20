"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { Lang } from "@/lib/db/types";

const LANGS: Lang[] = ["ko", "ja", "zh"];
const LANG_LABEL: Record<Lang, string> = { ko: "한국어", ja: "日本語", zh: "中文" };

interface CareerMain { current_title: string; current_org: string; skills: string; }
interface Entry { id?: number; section: string; period: string; title: string; sort_order: number; }

export default function AdminCareerPage() {
  const [tab, setTab] = useState<Lang>("ko");
  const [main, setMain] = useState<CareerMain>({ current_title: "", current_org: "", skills: "" });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [saved, setSaved] = useState(false);

  async function load(lang: Lang) {
    const [{ data: c }, { data: e }] = await Promise.all([
      supabase.from("careers").select("*").eq("lang", lang).single(),
      supabase.from("career_entries").select("*").eq("lang", lang).order("sort_order"),
    ]);
    setMain({ current_title: c?.current_title || "", current_org: c?.current_org || "", skills: (c?.skills || []).join(", ") });
    setEntries(e || []);
  }

  useEffect(() => { load(tab); }, [tab]);

  function updateEntry(idx: number, field: keyof Entry, value: string) {
    setEntries(prev => prev.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  }

  function addEntry() {
    setEntries(prev => [...prev, { section: "past", period: "", title: "", sort_order: prev.length }]);
  }

  async function removeEntry(idx: number) {
    const e = entries[idx];
    if (e.id) await supabase.from("career_entries").delete().eq("id", e.id);
    setEntries(prev => prev.filter((_, i) => i !== idx));
  }

  async function save() {
    await supabase.from("careers").upsert({
      lang: tab,
      current_title: main.current_title,
      current_org: main.current_org,
      skills: main.skills.split(",").map(s => s.trim()).filter(Boolean),
    }, { onConflict: "lang" });

    for (const [i, e] of entries.entries()) {
      const row = { lang: tab, section: e.section, period: e.period, title: e.title, sort_order: i };
      if (e.id) {
        await supabase.from("career_entries").update(row).eq("id", e.id);
      } else {
        const { data } = await supabase.from("career_entries").insert(row).select().single();
        if (data) setEntries(prev => prev.map((x, j) => j === i ? data : x));
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <Link href="/admin" style={s.back}>← Admin</Link>
        <h1 style={s.h1}>Career</h1>
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
        <div style={s.section}>
          <h2 style={s.sectionH}>현재</h2>
          <label style={s.field}><span style={s.lbl}>직함</span><input style={s.input} value={main.current_title} onChange={e => setMain(p => ({ ...p, current_title: e.target.value }))} /></label>
          <label style={s.field}><span style={s.lbl}>소속</span><input style={s.input} value={main.current_org} onChange={e => setMain(p => ({ ...p, current_org: e.target.value }))} /></label>
          <label style={s.field}><span style={s.lbl}>스킬 (쉼표로 구분)</span><input style={s.input} value={main.skills} onChange={e => setMain(p => ({ ...p, skills: e.target.value }))} /></label>
        </div>
        <div style={s.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={s.sectionH}>경력 항목</h2>
            <button style={s.addBtn} onClick={addEntry}>+ 추가</button>
          </div>
          {entries.map((e, idx) => (
            <div key={idx} style={s.entryRow}>
              <select style={s.select} value={e.section} onChange={v => updateEntry(idx, "section", v.target.value)}>
                <option value="past">경력</option>
                <option value="other">기타</option>
                <option value="credentials">자격</option>
              </select>
              <input style={{ ...s.input, flex: "0 0 100px" }} placeholder="기간" value={e.period} onChange={v => updateEntry(idx, "period", v.target.value)} />
              <input style={{ ...s.input, flex: 1 }} placeholder="내용" value={e.title} onChange={v => updateEntry(idx, "title", v.target.value)} />
              <button style={s.rmBtn} onClick={() => removeEntry(idx)}>×</button>
            </div>
          ))}
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
  form: { maxWidth: "740px", padding: "32px 40px", display: "flex", flexDirection: "column", gap: "32px" },
  section: { display: "flex", flexDirection: "column", gap: "12px" },
  sectionH: { fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6, marginBottom: "4px" },
  field: { display: "flex", flexDirection: "column", gap: "4px" },
  lbl: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6 },
  input: { padding: "9px 12px", border: "1px solid #ddd", fontSize: "0.9rem", fontFamily: "inherit" },
  entryRow: { display: "flex", gap: "8px", alignItems: "center" },
  select: { padding: "9px 8px", border: "1px solid #ddd", fontSize: "0.85rem" },
  addBtn: { padding: "6px 14px", border: "1px solid #ccc", background: "none", cursor: "pointer", fontSize: "0.8rem" },
  rmBtn: { padding: "6px 10px", border: "1px solid #ecc", background: "none", color: "#c00", cursor: "pointer" },
};
