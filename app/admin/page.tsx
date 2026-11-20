"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const sections = [
  { href: "/admin/about", label: "About", desc: "프로필 · 나의 이야기" },
  { href: "/admin/career", label: "Career", desc: "현재 직함 · 경력 항목" },
  { href: "/admin/projects", label: "Projects", desc: "프로젝트 그룹 · 항목" },
  { href: "/admin/interests", label: "Interests", desc: "관심사 목록" },
  { href: "/admin/life", label: "Life", desc: "사진 · 일상 기록" },
];

export default function AdminDashboard() {
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <h1 style={s.h1}>Admin</h1>
        <button style={s.signOut} onClick={signOut}>Sign out</button>
      </header>
      <main style={s.main}>
        {sections.map(sec => (
          <Link key={sec.href} href={sec.href} style={s.card}>
            <strong style={s.cardTitle}>{sec.label}</strong>
            <span style={s.cardDesc}>{sec.desc}</span>
          </Link>
        ))}
        <a href="/" target="_blank" style={{ ...s.card, background: "#f4efe8" }}>
          <strong style={s.cardTitle}>↗ 사이트 보기</strong>
          <span style={s.cardDesc}>방문자 페이지 새 탭으로 열기</span>
        </a>
      </main>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", background: "#f9f7f4", fontFamily: "system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 40px", borderBottom: "1px solid #e0dbd4", background: "#fff" },
  h1: { fontSize: "1.4rem", fontFamily: "Georgia, serif", fontWeight: 400 },
  signOut: { fontSize: "0.8rem", background: "none", border: "1px solid #ccc", padding: "8px 16px", cursor: "pointer" },
  main: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", padding: "40px" },
  card: { display: "flex", flexDirection: "column", gap: "6px", padding: "24px", background: "#fff", border: "1px solid #e0dbd4", textDecoration: "none", color: "inherit", transition: "border-color 0.15s" },
  cardTitle: { fontSize: "1rem", fontWeight: 600 },
  cardDesc: { fontSize: "0.8rem", opacity: 0.6 },
};
