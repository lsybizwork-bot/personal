"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { Lang } from "@/lib/db/types";

const LANGS: Lang[] = ["ko", "ja", "zh"];
const LANG_LABEL: Record<Lang, string> = { ko: "한국어", ja: "日本語", zh: "中文" };

interface ProjectWithTr {
  id?: number;
  slug: string;
  sort_order: number;
  translations: Record<Lang, { group_name: string; title: string; summary: string; url: string }>;
}

function emptyTr() { return { group_name: "", title: "", summary: "", url: "" }; }
function emptyProject(sort: number): ProjectWithTr {
  return { slug: "", sort_order: sort, translations: { ko: emptyTr(), ja: emptyTr(), zh: emptyTr() } };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithTr[]>([]);
  const [tab, setTab] = useState<Lang>("ko");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("project_translations").select("*"),
    ]).then(([{ data: ps }, { data: trs }]) => {
      const list: ProjectWithTr[] = (ps || []).map(p => {
        const myTrs = (trs || []).filter(t => t.project_id === p.id);
        const translations: Record<Lang, { group_name: string; title: string; summary: string; url: string }> = {
          ko: emptyTr(), ja: emptyTr(), zh: emptyTr(),
        };
        myTrs.forEach(t => { translations[t.lang as Lang] = { group_name: t.group_name || "", title: t.title || "", summary: t.summary || "", url: t.url || "" }; });
        return { id: p.id, slug: p.slug, sort_order: p.sort_order, translations };
      });
      setProjects(list);
      setLoading(false);
    });
  }, []);

  function updateTr(pidx: number, field: string, value: string) {
    setProjects(prev => prev.map((p, i) => i !== pidx ? p : {
      ...p,
      translations: { ...p.translations, [tab]: { ...p.translations[tab], [field]: value } },
    }));
  }

  function addProject() {
    setProjects(prev => [...prev, emptyProject(prev.length)]);
  }

  async function removeProject(idx: number) {
    const p = projects[idx];
    if (p.id) {
      await supabase.from("projects").delete().eq("id", p.id);
    }
    setProjects(prev => prev.filter((_, i) => i !== idx));
  }

  async function save() {
    for (const p of projects) {
      let pid = p.id;
      if (!pid) {
        const { data } = await supabase.from("projects").insert({ slug: p.slug || `p-${Date.now()}`, sort_order: p.sort_order }).select().single();
        pid = data?.id;
      } else {
        await supabase.from("projects").update({ slug: p.slug, sort_order: p.sort_order }).eq("id", pid);
      }
      if (!pid) continue;
      for (const lang of LANGS) {
        const tr = p.translations[lang];
        await supabase.from("project_translations").upsert({ project_id: pid, lang, ...tr }, { onConflict: "project_id,lang" });
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <Link href="/admin" style={s.back}>← Admin</Link>
        <h1 style={s.h1}>Projects</h1>
        <button style={s.addBtn} onClick={addProject}>+ 추가</button>
        <button style={s.btn} onClick={save}>{saved ? "저장됨 ✓" : "저장"}</button>
      </header>
      <div style={s.tabs}>
        {LANGS.map(l => (
          <button key={l} style={{ ...s.tab, ...(l === tab ? s.activeTab : {}) }} onClick={() => setTab(l)}>{LANG_LABEL[l]}</button>
        ))}
      </div>
      {loading ? <p style={s.empty}>불러오는 중…</p> : (
        <div style={s.list}>
          {projects.map((p, pidx) => (
            <div key={pidx} style={s.card}>
              <div style={s.cardTop}>
                <input style={{ ...s.input, flex: "0 0 160px" }} placeholder="slug (영문)" value={p.slug} onChange={e => setProjects(prev => prev.map((x, i) => i === pidx ? { ...x, slug: e.target.value } : x))} />
                <input style={{ ...s.input, flex: 1 }} placeholder={`그룹명 (${LANG_LABEL[tab]})`} value={p.translations[tab].group_name} onChange={e => updateTr(pidx, "group_name", e.target.value)} />
                <button style={s.rmBtn} onClick={() => removeProject(pidx)}>×</button>
              </div>
              <input style={s.input} placeholder={`제목 (${LANG_LABEL[tab]})`} value={p.translations[tab].title} onChange={e => updateTr(pidx, "title", e.target.value)} />
              <textarea style={{ ...s.input, minHeight: "60px", resize: "vertical" }} placeholder={`설명 (${LANG_LABEL[tab]})`} value={p.translations[tab].summary} onChange={e => updateTr(pidx, "summary", e.target.value)} />
              <input style={s.input} placeholder="URL" value={p.translations[tab].url} onChange={e => updateTr(pidx, "url", e.target.value)} />
            </div>
          ))}
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
  addBtn: { padding: "8px 16px", border: "1px solid #ccc", background: "none", cursor: "pointer", fontSize: "0.8rem" },
  tabs: { display: "flex", padding: "0 40px", borderBottom: "1px solid #e0dbd4", background: "#fff" },
  tab: { padding: "12px 20px", border: "none", background: "none", cursor: "pointer", fontSize: "0.85rem", borderBottom: "2px solid transparent" },
  activeTab: { borderBottomColor: "#1a1714", fontWeight: 600 },
  list: { padding: "32px 40px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "740px" },
  card: { background: "#fff", border: "1px solid #e0dbd4", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" },
  cardTop: { display: "flex", gap: "8px", alignItems: "center" },
  input: { padding: "9px 12px", border: "1px solid #ddd", fontSize: "0.85rem", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  rmBtn: { padding: "6px 10px", border: "1px solid #ecc", background: "none", color: "#c00", cursor: "pointer", flexShrink: 0 },
  empty: { padding: "80px 40px", textAlign: "center", opacity: 0.5 },
};
