"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import type { LifeEntryRow } from "@/lib/db/types";

interface UploadItem {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
  row?: LifeEntryRow;
}

export default function AdminLifePage() {
  const [entries, setEntries] = useState<LifeEntryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [editing, setEditing] = useState<LifeEntryRow | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragOver = useRef<number | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("life_entries")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setEntries(data || []);
    setLoading(false);
  }

  function pickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    addUploads(files);
    e.target.value = "";
  }

  function addUploads(files: File[]) {
    const items: UploadItem[] = files
      .filter(f => f.type.startsWith("image/"))
      .map(file => ({
        file,
        preview: URL.createObjectURL(file),
        status: "pending",
        progress: 0,
      }));
    setUploads(prev => [...prev, ...items]);
  }

  async function uploadAll() {
    const pending = uploads.filter(u => u.status === "pending" || u.status === "error");
    for (const item of pending) {
      await uploadOne(item);
    }
  }

  async function uploadOne(item: UploadItem) {
    const idx = uploads.findIndex(u => u.file === item.file && u.preview === item.preview);
    setUploads(prev => prev.map((u, i) => i === idx ? { ...u, status: "uploading", progress: 0 } : u));

    const ext = item.file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("life-photos")
      .upload(path, item.file, { contentType: item.file.type });

    if (upErr) {
      setUploads(prev => prev.map((u, i) => i === idx ? { ...u, status: "error", error: upErr.message } : u));
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("life-photos").getPublicUrl(path);

    const maxOrder = entries.length > 0 ? Math.max(...entries.map(e => e.sort_order)) : 0;
    const { data: row, error: dbErr } = await supabase
      .from("life_entries")
      .insert({ image_url: publicUrl, sort_order: maxOrder + 1, alt_ko: item.file.name })
      .select()
      .single();

    if (dbErr) {
      setUploads(prev => prev.map((u, i) => i === idx ? { ...u, status: "error", error: dbErr.message } : u));
      return;
    }

    setUploads(prev => prev.map((u, i) => i === idx ? { ...u, status: "done", progress: 100, row } : u));
    setEntries(prev => [...prev, row]);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    addUploads(Array.from(e.dataTransfer.files));
  }

  async function deleteSelected() {
    if (!selected.size) return;
    if (!confirm(`${selected.size}개를 삭제할까요?`)) return;
    for (const id of selected) {
      await supabase.from("life_entries").delete().eq("id", id);
    }
    setEntries(prev => prev.filter(e => !selected.has(e.id)));
    setSelected(new Set());
  }

  async function saveEdit() {
    if (!editing) return;
    await supabase.from("life_entries").update({
      title_ko: editing.title_ko,
      title_ja: editing.title_ja,
      title_zh: editing.title_zh,
      text_ko: editing.text_ko,
      text_ja: editing.text_ja,
      text_zh: editing.text_zh,
      alt_ko: editing.alt_ko,
      date: editing.date,
    }).eq("id", editing.id);
    setEntries(prev => prev.map(e => e.id === editing.id ? editing : e));
    setEditing(null);
  }

  async function moveUp(idx: number) {
    if (idx === 0) return;
    const a = entries[idx];
    const b = entries[idx - 1];
    await supabase.from("life_entries").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("life_entries").update({ sort_order: a.sort_order }).eq("id", b.id);
    const next = [...entries];
    next[idx] = { ...a, sort_order: b.sort_order };
    next[idx - 1] = { ...b, sort_order: a.sort_order };
    next.sort((x, y) => x.sort_order - y.sort_order);
    setEntries(next);
  }

  async function moveDown(idx: number) {
    if (idx === entries.length - 1) return;
    await moveUp(idx + 1);
  }

  function toggleSelect(id: number) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <Link href="/admin" style={s.back}>← Admin</Link>
        <h1 style={s.h1}>Life</h1>
        {selected.size > 0 && (
          <button style={s.del} onClick={deleteSelected}>선택 삭제 ({selected.size})</button>
        )}
      </header>

      {/* 업로드 영역 */}
      <section
        style={s.dropzone}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={pickFiles} />
        <span style={s.dropText}>사진을 여기에 끌어다 놓거나 클릭하여 선택</span>
      </section>

      {uploads.length > 0 && (
        <section style={s.uploadQueue}>
          <div style={s.uploadHeader}>
            <span>대기 중 {uploads.filter(u => u.status === "pending").length}개</span>
            <button style={s.btn} onClick={uploadAll}>전체 업로드</button>
          </div>
          <div style={s.uploadList}>
            {uploads.map((u, i) => (
              <div key={i} style={s.uploadItem}>
                <img src={u.preview} alt="" style={s.uploadThumb} />
                <div style={s.uploadInfo}>
                  <span style={{ fontSize: "0.8rem" }}>{u.file.name}</span>
                  <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                    {u.status === "pending" && "대기"}
                    {u.status === "uploading" && "업로드 중…"}
                    {u.status === "done" && "✓ 완료"}
                    {u.status === "error" && `✗ ${u.error}`}
                  </span>
                  {u.status === "error" && (
                    <button style={s.retryBtn} onClick={() => uploadOne(u)}>재시도</button>
                  )}
                </div>
                {u.status === "uploading" && (
                  <div style={{ ...s.bar, width: `${u.progress}%` }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 갤러리 그리드 */}
      {loading ? (
        <p style={s.empty}>불러오는 중…</p>
      ) : entries.length === 0 ? (
        <p style={s.empty}>아직 사진이 없습니다.</p>
      ) : (
        <div style={s.grid}>
          {entries.map((e, idx) => (
            <div
              key={e.id}
              style={{ ...s.card, outline: selected.has(e.id) ? "2px solid #5c1f2e" : "none" }}
            >
              <img
                src={e.image_url}
                alt={e.alt_ko || ""}
                style={s.thumb}
                onClick={() => toggleSelect(e.id)}
              />
              <div style={s.cardBody}>
                <span style={s.cardDate}>{e.date || "날짜 없음"}</span>
                <p style={s.cardTitle}>{e.title_ko || "(제목 없음)"}</p>
                <p style={s.cardText}>{e.text_ko || ""}</p>
                <div style={s.cardActions}>
                  <button style={s.smallBtn} onClick={() => setEditing(e)}>편집</button>
                  <button style={s.smallBtn} onClick={() => moveUp(idx)} disabled={idx === 0}>↑</button>
                  <button style={s.smallBtn} onClick={() => moveDown(idx)} disabled={idx === entries.length - 1}>↓</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 편집 모달 */}
      {editing && (
        <div style={s.overlay} onClick={() => setEditing(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalH2}>사진 편집</h2>
            <img src={editing.image_url} alt="" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", marginBottom: "16px" }} />
            {(["ko", "ja", "zh"] as const).map(lang => (
              <div key={lang} style={s.langBlock}>
                <div style={s.langLabel}>{lang === "ko" ? "한국어" : lang === "ja" ? "日本語" : "中文"}</div>
                <input
                  style={s.inputField}
                  placeholder="제목"
                  value={(editing[`title_${lang}`] as string) || ""}
                  onChange={e => setEditing(prev => prev ? { ...prev, [`title_${lang}`]: e.target.value } : null)}
                />
                <textarea
                  style={{ ...s.inputField, minHeight: "80px", resize: "vertical" }}
                  placeholder="본문"
                  value={(editing[`text_${lang}`] as string) || ""}
                  onChange={e => setEditing(prev => prev ? { ...prev, [`text_${lang}`]: e.target.value } : null)}
                />
              </div>
            ))}
            <input
              style={s.inputField}
              placeholder="날짜 (예: 2024.11)"
              value={editing.date || ""}
              onChange={e => setEditing(prev => prev ? { ...prev, date: e.target.value } : null)}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button style={s.btn} onClick={saveEdit}>저장</button>
              <button style={{ ...s.btn, background: "#eee", color: "#333" }} onClick={() => setEditing(null)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", background: "#f9f7f4", fontFamily: "system-ui, sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "16px", padding: "20px 40px", borderBottom: "1px solid #e0dbd4", background: "#fff" },
  back: { color: "#666", textDecoration: "none", fontSize: "0.85rem" },
  h1: { fontFamily: "Georgia, serif", fontSize: "1.4rem", fontWeight: 400, flex: 1 },
  del: { padding: "8px 16px", background: "#5c1f2e", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.8rem" },
  dropzone: { margin: "32px 40px 0", border: "2px dashed #ccc", borderRadius: "4px", padding: "48px", textAlign: "center", cursor: "pointer", background: "#fff" },
  dropText: { fontSize: "0.9rem", color: "#888" },
  uploadQueue: { margin: "24px 40px 0", background: "#fff", border: "1px solid #e0dbd4", padding: "16px" },
  uploadHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  uploadList: { display: "flex", flexDirection: "column", gap: "8px" },
  uploadItem: { display: "flex", alignItems: "center", gap: "12px", position: "relative" },
  uploadThumb: { width: "48px", height: "48px", objectFit: "cover", flexShrink: 0 },
  uploadInfo: { flex: 1, display: "flex", flexDirection: "column", gap: "2px" },
  bar: { position: "absolute", bottom: 0, left: 0, height: "2px", background: "#5c1f2e", transition: "width 0.3s" },
  retryBtn: { fontSize: "0.75rem", border: "1px solid #ccc", background: "none", padding: "2px 8px", cursor: "pointer" },
  btn: { padding: "8px 20px", background: "#1a1714", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.05em" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px", padding: "32px 40px" },
  card: { background: "#fff", border: "1px solid #e0dbd4", overflow: "hidden" },
  thumb: { width: "100%", aspectRatio: "4/3", objectFit: "cover", cursor: "pointer", display: "block" },
  cardBody: { padding: "12px" },
  cardDate: { fontSize: "0.75rem", opacity: 0.5 },
  cardTitle: { fontWeight: 600, marginTop: "4px", marginBottom: "4px", fontSize: "0.9rem" },
  cardText: { fontSize: "0.8rem", opacity: 0.7, overflow: "hidden", maxHeight: "60px" },
  cardActions: { display: "flex", gap: "6px", marginTop: "8px" },
  smallBtn: { padding: "4px 10px", fontSize: "0.75rem", border: "1px solid #ccc", background: "none", cursor: "pointer" },
  empty: { padding: "80px 40px", textAlign: "center", opacity: 0.5 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#fff", padding: "32px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" },
  modalH2: { fontFamily: "Georgia, serif", fontSize: "1.2rem", fontWeight: 400, marginBottom: "16px" },
  langBlock: { marginBottom: "16px" },
  langLabel: { fontSize: "0.75rem", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6 },
  inputField: { width: "100%", padding: "8px 10px", border: "1px solid #ddd", fontSize: "0.9rem", fontFamily: "inherit", marginBottom: "6px", boxSizing: "border-box" },
};
