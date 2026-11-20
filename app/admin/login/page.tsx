"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("비밀번호가 틀렸습니다.");
      setLoading(false);
    } else {
      router.replace("/admin");
    }
  }

  return (
    <div style={styles.wrap}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.h1}>Admin</h1>
        <label style={styles.label}>
          Password
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoFocus
            placeholder="••••••••"
          />
        </label>
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? "…" : "로그인"}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4efe8" },
  form: { background: "#fff", padding: "48px", width: "100%", maxWidth: "320px", border: "1px solid #e5e0d8" },
  h1: { fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 400, marginBottom: "32px" },
  label: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" },
  input: { padding: "12px", border: "1px solid #ccc", fontSize: "1.2rem", fontFamily: "inherit", outline: "none", letterSpacing: "0.15em" },
  error: { color: "#c0392b", fontSize: "0.85rem", marginBottom: "12px" },
  btn: { width: "100%", padding: "12px", background: "#1a1714", color: "#fff", border: "none", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" },
};
