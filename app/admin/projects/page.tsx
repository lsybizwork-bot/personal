"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { Lang } from "@/lib/db/types";

const LANGS: Lang[] = ["ko", "ja", "zh"];
const LANG_LABEL: Record<Lang, string> = { ko: "한국어", ja: "日本語", zh: "中文" };

interface ProjectItem { title: string; }
interface ProjectGroup {
  id?: number;
  slug: string;
  sort_order: number;
  tr: {
    id?: number;
    group_name: string;
    summary: string;
    hide_count: boolean;
    items: ProjectItem[];
  };
}

function emptyGroup(sort: number): ProjectGroup {
  return { slug: "", sort_order: sort, tr: { group_name: "", summary: "", hide_count: false, items: [] } };
}

export default function AdminProjectsPage() {
  const [tab, setTab] = useState<Lang>("ko");
  const [groups, setGroups] = useState<ProjectGroup[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load(lang: Lang) {
    setLoading(true);
    const [{ data: ps }, { data: trs }] = await Promise.all([
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("project_translations").select("*").eq("lang", lang),
    ]);
    const list: ProjectGroup[] = (ps || []).map(p => {
      const tr = (trs || []).find(t => t.project_id === p.id);
      const rawItems: ProjectItem[] = Array.isArray(tr?.items) ? tr.items : [];
      return {
        id: p.id,
        slug: p.slug,
        sort_order: p.sort_order,
        tr: {
          id: tr?.id,
          group_name: tr?.group_name || "",
          summary: tr?.summary || "",
          hide_count: tr?.hide_count || false,
          items: rawItems.map((x: ProjectItem | string) =>
            typeof x === "string" ? { title: x } : { title: x.title || "" }
          ),
        },
      };
    });
    setGroups(list);
    setLoading(false);
  }

  useEffect(() => { load(tab); }, [tab]);

  function updateTr(gIdx: number, field: string, value: unknown) {
    setGroups(gs => gs.map((g, i) => i !== gIdx ? g : { ...g, tr: { ...g.tr, [field]: value } }));
  }
  function updateSlug(gIdx: number, v: string) {
    setGroups(gs => gs.map((g, i) => i !== gIdx ? g : { ...g, slug: v }));
  }

  function addGroup() { setGroups(gs => [...gs, emptyGroup(gs.length)]); }
  async function removeGroup(gIdx: number) {
    const g = groups[gIdx];
    if (g.id) await supabase.from("projects").delete().eq("id", g.id);
    setGroups(gs => gs.filter((_, i) => i !== gIdx));
  }

  function addItem(gIdx: number) {
    setGroups(gs => gs.map((g, i) => i !== gIdx ? g : { ...g, tr: { ...g.tr, items: [...g.tr.items, { title: "" }] } }));
  }
  function removeItem(gIdx: number, iIdx: number) {
    setGroups(gs => gs.map((g, i) => i !== gIdx ? g : { ...g, tr: { ...g.tr, items: g.tr.items.filter((_, j) => j !== iIdx) } }));
  }
  function updateItem(gIdx: number, iIdx: number, v: string) {
    setGroups(gs => gs.map((g, i) => i !== gIdx ? g : {
      ...g, tr: { ...g.tr, items: g.tr.items.map((x, j) => j !== iIdx ? x : { title: v }) },
    }));
  }

  async function save() {
    for (const [i, g] of groups.entries()) {
      let pid = g.id;
      if (!pid) {
        const { data } = await supabase.from("projects").insert({ slug: g.slug || `g-${Date.now()}-${i}`, sort_order: i }).select().single();
        pid = data?.id;
      } else {
        await supabase.from("projects").update({ slug: g.slug, sort_order: i }).eq("id", pid);
      }
      if (!pid) continue;
      await supabase.from("project_translations").upsert({
        project_id: pid, lang: tab,
        group_name: g.tr.group_name,
        title: g.tr.group_name,
        summary: g.tr.summary,
        url: "",
        hide_count: g.tr.hide_count,
        items: g.tr.items.filter(x => x.title.trim()),
      }, { onConflict: "project_id,lang" });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <Link href="/admin" style={s.back}>← Admin</Link>
        <h1 style={s.h1}>Projects</h1>
        <button style={s.addGroupBtn} onClick={addGroup}>+ 분야 추가</button>
        <button style={s.btn} onClick={save}>{saved ? "저장됨 ✓" : "저장"}</button>
      </header>
      <div style={s.tabs}>
        {LANGS.map(l => (
          <button key={l} style={{ ...s.tab, ...(l === tab ? s.activeTab : {}) }} onClick={() => setTab(l)}>
            {LANG_LABEL[l]}
          </button>
        ))}
      </div>
      {loading ? <p style={s.empty}>불러오는 중…</p> : (
        <div style={s.list}>
          {groups.map((g, gIdx) => (
            <div key={gIdx} style={s.card}>
              <div style={s.cardTop}>
                <input style={{ ...s.input, flex: "0 0 140px", fontSize: "0.78rem" }} placeholder="slug (영문)" value={g.slug} onChange={e => updateSlug(gIdx, e.target.value)} />
                <input style={{ ...s.input, flex: 1, fontWeight: 600 }} placeholder="분야명" value={g.tr.group_name} onChange={e => updateTr(gIdx, "group_name", e.target.value)} />
                <label style={s.checkLabel}>
                  <input type="checkbox" checked={g.tr.hide_count} onChange={e => updateTr(gIdx, "hide_count", e.target.checked)} />
                  건수 숨김
                </label>
                <button style={s.rmBtn} onClick={() => removeGroup(gIdx)}>분야 삭제</button>
              </div>
              <input style={s.input} placeholder="한 줄 설명 (summary)" value={g.tr.summary} onChange={e => updateTr(gIdx, "summary", e.target.value)} />

              {/* 개별 프로젝트 목록 */}
              <div style={s.itemsSection}>
                <div style={s.itemsHeader}>
                  <span style={s.itemsLabel}>프로젝트 목록 ({g.tr.items.length}건)</span>
                  <button style={s.addItemBtn} onClick={() => addItem(gIdx)}>+ 프로젝트 추가</button>
                </div>
                {g.tr.items.map((item, iIdx) => (
                  <div key={iIdx} style={s.itemRow}>
                    <input style={{ ...s.input, flex: 1 }} placeholder="프로젝트명" value={item.title} onChange={e => updateItem(gIdx, iIdx, e.target.value)} />
                    <button style={s.rmItemBtn} onClick={() => removeItem(gIdx, iIdx)}>×</button>
                  </div>
                ))}
                {g.tr.items.length === 0 && <p style={s.hint}>프로젝트를 추가하세요.</p>}
              </div>
            </div>
          ))}
          {groups.length === 0 && <p style={s.empty}>분야를 추가하세요.</p>}
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", background: "#f9f7f4", fontFamily: "system-ui, sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "12px", padding: "20px 40px", borderBottom: "1px solid #e0dbd4", background: "#fff" },
  back: { color: "#666", textDecoration: "none", fontSize: "0.85rem" },
  h1: { fontFamily: "Georgia, serif", fontSize: "1.4rem", fontWeight: 400, flex: 1 },
  btn: { padding: "8px 20px", background: "#1a1714", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.8rem" },
  addGroupBtn: { padding: "8px 16px", border: "1px solid #ccc", background: "none", cursor: "pointer", fontSize: "0.8rem" },
  tabs: { display: "flex", padding: "0 40px", borderBottom: "1px solid #e0dbd4", background: "#fff" },
  tab: { padding: "12px 20px", border: "none", background: "none", cursor: "pointer", fontSize: "0.85rem", borderBottom: "2px solid transparent" },
  activeTab: { borderBottomColor: "#1a1714", fontWeight: 600 },
  list: { padding: "32px 40px", display: "flex", flexDirection: "column", gap: "20px", maxWidth: "780px" },
  card: { background: "#fff", border: "1px solid #e0dbd4", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" },
  cardTop: { display: "flex", gap: "8px", alignItems: "center" },
  input: { padding: "9px 12px", border: "1px solid #ddd", fontSize: "0.9rem", fontFamily: "inherit", width: "100%", boxSizing: "border-box" as const },
  checkLabel: { display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", whiteSpace: "nowrap" as const, cursor: "pointer" },
  rmBtn: { padding: "6px 12px", border: "1px solid #ecc", background: "none", color: "#c00", cursor: "pointer", fontSize: "0.78rem", flexShrink: 0 },
  itemsSection: { background: "#f9f7f4", border: "1px solid #ede8e1", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px" },
  itemsHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  itemsLabel: { fontSize: "0.78rem", fontWeight: 600, opacity: 0.55 },
  addItemBtn: { padding: "4px 10px", border: "1px solid #ccc", background: "none", cursor: "pointer", fontSize: "0.78rem" },
  itemRow: { display: "flex", gap: "6px", alignItems: "center" },
  rmItemBtn: { padding: "5px 9px", border: "1px solid #ecc", background: "none", color: "#c00", cursor: "pointer", flexShrink: 0 },
  hint: { fontSize: "0.78rem", opacity: 0.4 },
  empty: { padding: "80px 40px", textAlign: "center", opacity: 0.5 },
};
