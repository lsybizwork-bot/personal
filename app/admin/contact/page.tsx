"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface ContactData {
  email: string;
  kakao: string;
  line: string;
  wechat: string;
}

const empty: ContactData = { email: "", kakao: "", line: "", wechat: "" };

export default function AdminContactPage() {
  const [data, setData] = useState<ContactData>(empty);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // contact는 언어 무관 — ko 행 기준으로 읽기
    supabase.from("profiles").select("contact_email,contact_kakao,contact_line,contact_wechat").eq("lang", "ko").single()
      .then(({ data: d }) => {
        if (d) {
          setData({
            email:  d.contact_email  ?? "",
            kakao:  d.contact_kakao  ?? "",
            line:   d.contact_line   ?? "",
            wechat: d.contact_wechat ?? "",
          });
        }
        setLoading(false);
      });
  }, []);

  async function save() {
    const payload = {
      contact_email:  data.email,
      contact_kakao:  data.kakao,
      contact_line:   data.line,
      contact_wechat: data.wechat,
    };
    // 세 언어 모두 동일 값으로 저장
    await Promise.all(
      (["ko", "ja", "zh"] as const).map((lang) =>
        supabase.from("profiles").upsert({ lang, ...payload }, { onConflict: "lang" })
      )
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields: { key: keyof ContactData; label: string; placeholder: string }[] = [
    { key: "email",  label: "이메일",  placeholder: "hello@example.com" },
    { key: "kakao",  label: "카카오톡", placeholder: "오픈채팅 URL (https://open.kakao.com/...)" },
    { key: "line",   label: "라인",    placeholder: "라인 링크 (https://line.me/ti/p/...)" },
    { key: "wechat", label: "위챗",    placeholder: "위챗 ID 또는 링크" },
  ];

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <Link href="/admin" style={s.back}>← Admin</Link>
        <h1 style={s.h1}>Contact</h1>
        <button style={s.btn} onClick={save}>{saved ? "저장됨 ✓" : "저장"}</button>
      </header>
      {loading ? <p style={s.empty}>불러오는 중…</p> : (
        <div style={s.form}>
          <p style={s.note}>비워 두면 해당 버튼이 화면에 나타나지 않습니다.</p>
          {fields.map(({ key, label, placeholder }) => (
            <label key={key} style={s.field}>
              <span style={s.fieldLabel}>{label}</span>
              <input
                style={s.input}
                value={data[key]}
                placeholder={placeholder}
                onChange={(e) => setData((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </label>
          ))}
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
  btn: { padding: "8px 20px", background: "#1a1714", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.8rem" },
  form: { maxWidth: "560px", padding: "32px 40px", display: "flex", flexDirection: "column", gap: "20px" },
  note: { fontSize: "0.8rem", opacity: 0.55, marginBottom: "4px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  fieldLabel: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6 },
  input: { padding: "10px 12px", border: "1px solid #ddd", fontSize: "0.95rem", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  empty: { padding: "80px 40px", textAlign: "center", opacity: 0.5 },
};
