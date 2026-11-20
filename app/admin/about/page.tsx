"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { Lang } from "@/lib/db/types";

const LANGS: Lang[] = ["ko", "ja", "zh"];
const LANG_LABEL: Record<Lang, string> = { ko: "한국어", ja: "日本語", zh: "中文" };

interface Row { lang: Lang; site_name: string; hero_title: string; hero_desc: string; about_first: string; about_body: string; }

export default function AdminAboutPage() {
  const [rows, setRows] = useState<Record<Lang, Row>>({
    ko: { lang: "ko", site_name: "", hero_title: "", hero_desc: "", about_first: "", about_body: "" },
    ja: { lang: "ja", site_name: "", hero_title: "", hero_desc: "", about_first: "", about_body: "" },
    zh: { lang: "zh", site_name: "", hero_title: "", hero_desc: "", about_first: "", about_body: "" },
  });
  const [tab, setTab] = useState<Lang>("ko");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("*").then(({ data }) => {
      if (data) {
        const next = { ...rows };
        data.forEach((d: Row) => { next[d.lang as Lang] = d; });
        setRows(next);
      }
      setLoading(false);
    });
  }, []);

  function update(field: keyof Row, value: string) {
    setRows(prev => ({ ...prev, [tab]: { ...prev[tab], [field]: value } }));
  }

  async function save() {
    const row = rows[tab];
    await supabase.from("profiles").upsert({ ...row }, { onConflict: "lang" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const r = rows[tab];

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <Link href="/admin" style={s.back}>← Admin</Link>
        <h1 style={s.h1}>About</h1>
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
        <div style={s.form}>
          <Field label="사이트 이름" value={r.site_name} onChange={v => update("site_name", v)} />
          <Field label="Hero 제목" value={r.hero_title} onChange={v => update("hero_title", v)} />
          <Field label="Hero 설명" value={r.hero_desc} onChange={v => update("hero_desc", v)} />
          <Field label="About 첫 문단 (강조)" value={r.about_first} onChange={v => update("about_first", v)} textarea />
          <Field label="About 본문 (줄바꿈으로 문단 구분)" value={r.about_body} onChange={v => update("about_body", v)} textarea rows={8} />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, textarea, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number }) {
  return (
    <label style={s.field}>
      <span style={s.fieldLabel}>{label}</span>
      {textarea
        ? <textarea style={{ ...s.input, minHeight: `${rows * 24}px`, resize: "vertical" }} value={value} onChange={e => onChange(e.target.value)} />
        : <input style={s.input} value={value} onChange={e => onChange(e.target.value)} />}
    </label>
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
  form: { maxWidth: "640px", padding: "32px 40px", display: "flex", flexDirection: "column", gap: "20px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  fieldLabel: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6 },
  input: { padding: "10px 12px", border: "1px solid #ddd", fontSize: "0.95rem", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  empty: { padding: "80px 40px", textAlign: "center", opacity: 0.5 },
};
