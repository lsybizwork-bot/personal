"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { Lang } from "@/lib/db/types";

const LANGS: Lang[] = ["ko", "ja", "zh"];
const LANG_LABEL: Record<Lang, string> = { ko: "한국어", ja: "日本語", zh: "中文" };

// section 값 규약:
//   "경력"        → 이전 경력, period=분야, title=역할
//   "경력_기타"   → extraLines, period="", title=한 줄 텍스트
//   "학력" / "자격 및 어학" / "수상" (또는 사용자 정의) → 학력·자격·수상 항목
//     period = note(부가 설명, 선택), title = 항목명

interface Entry { id?: number; section: string; period: string; title: string; sort_order: number; }

const CRED_SECTIONS = ["학력", "자격 및 어학", "수상"] as const;

export default function AdminCareerPage() {
  const [tab, setTab] = useState<Lang>("ko");
  const [currentTitle, setCurrentTitle] = useState("");
  const [pastEntries, setPastEntries] = useState<Entry[]>([]);
  const [extraLines, setExtraLines] = useState<Entry[]>([]);
  const [credGroups, setCredGroups] = useState<{ section: string; items: Entry[] }[]>([]);
  const [saved, setSaved] = useState(false);

  async function load(lang: Lang) {
    const [{ data: c }, { data: e }] = await Promise.all([
      supabase.from("careers").select("*").eq("lang", lang).single(),
      supabase.from("career_entries").select("*").eq("lang", lang).order("sort_order"),
    ]);
    setCurrentTitle(c?.current_title || "");
    const all: Entry[] = e || [];
    setPastEntries(all.filter(x => x.section === "경력"));
    setExtraLines(all.filter(x => x.section === "경력_기타"));
    // 그 외는 credential 그룹
    const credEntries = all.filter(x => x.section !== "경력" && x.section !== "경력_기타");
    // 섹션별로 그룹화
    const sectionMap: Record<string, Entry[]> = {};
    credEntries.forEach(item => {
      if (!sectionMap[item.section]) sectionMap[item.section] = [];
      sectionMap[item.section].push(item);
    });
    // CRED_SECTIONS 순서 유지 + 추가 섹션
    const knownSections = [...CRED_SECTIONS].filter(s => sectionMap[s]);
    const otherSections = Object.keys(sectionMap).filter(s => !CRED_SECTIONS.includes(s as typeof CRED_SECTIONS[number]));
    const orderedSections = [...knownSections, ...otherSections];
    if (orderedSections.length === 0) {
      setCredGroups(CRED_SECTIONS.map(s => ({ section: s, items: [] })));
    } else {
      setCredGroups(orderedSections.map(s => ({ section: s, items: sectionMap[s] || [] })));
    }
  }

  useEffect(() => { load(tab); }, [tab]);

  function addPast() {
    setPastEntries(p => [...p, { section: "경력", period: "", title: "", sort_order: p.length }]);
  }
  function removePast(i: number) {
    const e = pastEntries[i];
    if (e.id) supabase.from("career_entries").delete().eq("id", e.id);
    setPastEntries(p => p.filter((_, j) => j !== i));
  }
  function updatePast(i: number, field: "period" | "title", v: string) {
    setPastEntries(p => p.map((x, j) => j === i ? { ...x, [field]: v } : x));
  }

  function addExtra() {
    setExtraLines(p => [...p, { section: "경력_기타", period: "", title: "", sort_order: p.length }]);
  }
  function removeExtra(i: number) {
    const e = extraLines[i];
    if (e.id) supabase.from("career_entries").delete().eq("id", e.id);
    setExtraLines(p => p.filter((_, j) => j !== i));
  }
  function updateExtra(i: number, v: string) {
    setExtraLines(p => p.map((x, j) => j === i ? { ...x, title: v } : x));
  }

  function addCredItem(gIdx: number) {
    setCredGroups(gs => gs.map((g, i) => i !== gIdx ? g : {
      ...g, items: [...g.items, { section: g.section, period: "", title: "", sort_order: g.items.length }],
    }));
  }
  function removeCredItem(gIdx: number, iIdx: number) {
    const item = credGroups[gIdx].items[iIdx];
    if (item.id) supabase.from("career_entries").delete().eq("id", item.id);
    setCredGroups(gs => gs.map((g, i) => i !== gIdx ? g : { ...g, items: g.items.filter((_, j) => j !== iIdx) }));
  }
  function updateCredItem(gIdx: number, iIdx: number, field: "title" | "period", v: string) {
    setCredGroups(gs => gs.map((g, i) => i !== gIdx ? g : {
      ...g,
      items: g.items.map((x, j) => j !== iIdx ? x : { ...x, [field]: v }),
    }));
  }

  async function upsertEntry(e: Entry, sort: number, lang: Lang): Promise<Entry> {
    const row = { lang, section: e.section, period: e.period, title: e.title, sort_order: sort };
    if (e.id) {
      await supabase.from("career_entries").update(row).eq("id", e.id);
      return e;
    } else {
      const { data } = await supabase.from("career_entries").insert(row).select().single();
      return data || e;
    }
  }

  async function save() {
    await supabase.from("careers").upsert({ lang: tab, current_title: currentTitle, current_org: "", skills: [] }, { onConflict: "lang" });
    // 모든 entries 저장
    let sort = 0;
    const newPast: Entry[] = [];
    for (const e of pastEntries) {
      newPast.push(await upsertEntry(e, sort++, tab));
    }
    setPastEntries(newPast);

    const newExtra: Entry[] = [];
    for (const e of extraLines) {
      newExtra.push(await upsertEntry(e, sort++, tab));
    }
    setExtraLines(newExtra);

    const newGroups = [...credGroups];
    for (let g = 0; g < credGroups.length; g++) {
      const newItems: Entry[] = [];
      for (const item of credGroups[g].items) {
        newItems.push(await upsertEntry(item, sort++, tab));
      }
      newGroups[g] = { ...newGroups[g], items: newItems };
    }
    setCredGroups(newGroups);

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

        {/* 현재 직책 */}
        <div style={s.section}>
          <h2 style={s.sectionH}>현재</h2>
          <label style={s.field}>
            <span style={s.lbl}>현재 직책 (기관명 포함 전체)</span>
            <input style={s.input} value={currentTitle} onChange={e => setCurrentTitle(e.target.value)} placeholder="예: 인천서해구문화재단 문화정책팀장" />
          </label>
        </div>

        {/* 이전 경력 */}
        <div style={s.section}>
          <div style={s.secRow}>
            <h2 style={s.sectionH}>이전 경력</h2>
            <button style={s.addBtn} onClick={addPast}>+ 추가</button>
          </div>
          {pastEntries.map((e, i) => (
            <div key={i} style={s.entryRow}>
              <input style={{ ...s.input, flex: "0 0 140px" }} placeholder="분야" value={e.period} onChange={v => updatePast(i, "period", v.target.value)} />
              <input style={{ ...s.input, flex: 1 }} placeholder="역할/내용" value={e.title} onChange={v => updatePast(i, "title", v.target.value)} />
              <button style={s.rmBtn} onClick={() => removePast(i)}>×</button>
            </div>
          ))}
          {pastEntries.length === 0 && <p style={s.hint}>경력 항목을 추가하세요.</p>}
        </div>

        {/* 기타 경력 (extraLines) */}
        <div style={s.section}>
          <div style={s.secRow}>
            <h2 style={s.sectionH}>기타 경력 (한 줄)</h2>
            <button style={s.addBtn} onClick={addExtra}>+ 추가</button>
          </div>
          {extraLines.map((e, i) => (
            <div key={i} style={s.entryRow}>
              <input style={{ ...s.input, flex: 1 }} placeholder="한 줄 경력 텍스트" value={e.title} onChange={v => updateExtra(i, v.target.value)} />
              <button style={s.rmBtn} onClick={() => removeExtra(i)}>×</button>
            </div>
          ))}
        </div>

        {/* 학력 · 자격 · 수상 */}
        <div style={s.section}>
          <h2 style={s.sectionH}>학력 · 자격 · 수상</h2>
          {credGroups.map((g, gIdx) => (
            <div key={gIdx} style={s.credGroup}>
              <div style={s.credGroupHeader}>
                <span style={s.credGroupTitle}>{g.section}</span>
                <button style={s.addBtn} onClick={() => addCredItem(gIdx)}>+ 항목 추가</button>
              </div>
              {g.items.map((item, iIdx) => (
                <div key={iIdx} style={s.credRow}>
                  <input style={{ ...s.input, flex: 1 }} placeholder="항목명" value={item.title} onChange={v => updateCredItem(gIdx, iIdx, "title", v.target.value)} />
                  <input style={{ ...s.input, flex: "0 0 220px" }} placeholder="부가설명 (선택)" value={item.period} onChange={v => updateCredItem(gIdx, iIdx, "period", v.target.value)} />
                  <button style={s.rmBtn} onClick={() => removeCredItem(gIdx, iIdx)}>×</button>
                </div>
              ))}
              {g.items.length === 0 && <p style={s.hint}>항목이 없습니다.</p>}
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
  form: { maxWidth: "740px", padding: "32px 40px", display: "flex", flexDirection: "column", gap: "36px" },
  section: { display: "flex", flexDirection: "column", gap: "10px" },
  secRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  sectionH: { fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6 },
  field: { display: "flex", flexDirection: "column", gap: "4px" },
  lbl: { fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", opacity: 0.5 },
  input: { padding: "9px 12px", border: "1px solid #ddd", fontSize: "0.9rem", fontFamily: "inherit", boxSizing: "border-box" as const },
  entryRow: { display: "flex", gap: "8px", alignItems: "center" },
  addBtn: { padding: "5px 12px", border: "1px solid #ccc", background: "none", cursor: "pointer", fontSize: "0.8rem" },
  rmBtn: { padding: "6px 10px", border: "1px solid #ecc", background: "none", color: "#c00", cursor: "pointer", flexShrink: 0 },
  hint: { fontSize: "0.8rem", opacity: 0.4, padding: "4px 0" },
  credGroup: { background: "#fff", border: "1px solid #e0dbd4", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" },
  credGroupHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  credGroupTitle: { fontSize: "0.85rem", fontWeight: 600 },
  credRow: { display: "flex", gap: "8px", alignItems: "center" },
};
