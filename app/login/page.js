"use client" // ブラウザ側で動くコードという宣言

import { useState } from "react"       // 入力値などの状態を管理する
import { signIn } from "next-auth/react" // NextAuthのログイン関数をインポート
import { useRouter } from "next/navigation" // ページ遷移のための関数をインポート

export default function LoginPage() {
  const [email, setEmail] = useState("")       // メールアドレスの入力値
  const [password, setPassword] = useState("") // パスワードの入力値
  const [error, setError] = useState("")       // エラーメッセージ
  const [loading, setLoading] = useState(false) // ログイン中フラグ

  const router = useRouter() // ページ遷移に使う

  // ログインボタンを押したときの処理
  async function handleLogin() {
    setLoading(true)
    setError("") // 前回のエラーをリセット

    // NextAuthのsignIn関数でログインを試みる
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // 自動リダイレクトをオフにして結果を受け取る
    })

    if (result?.ok) {
      // ログイン成功：トップページに移動する
      router.push("/")
    } else {
      // ログイン失敗：エラーメッセージを表示する
      setError("メールアドレスまたはパスワードが違います")
      setLoading(false)
    }
  }

  return (
    <>
      {/* グローバルスタイル */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');

        :root {
          --gold: #C9A84C;
          --gold-light: #E8CC7A;
          --gold-dim: rgba(201,168,76,0.15);
          --dark: #0D0D0D;
          --dark2: #141414;
          --dark3: #1C1C1C;
          --text: #F0EDE6;
          --text-muted: #888880;
          --border: rgba(201,168,76,0.25);
          --error: #E05555;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--dark);
          color: var(--text);
          font-family: 'Zen Kaku Gothic New', sans-serif;
          min-height: 100vh;
        }

        /* ページ全体を中央に配置するコンテナ */
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%),
            var(--dark);
        }

        /* ヘッダー */
        .login-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .header-line {
          width: 48px;
          height: 1px;
          background: var(--gold);
          margin: 0 auto 24px;
        }

        .header-eyebrow {
          font-size: 11px;
          letter-spacing: 0.3em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 600;
          color: var(--text);
        }

        /* ログインカード */
        .login-card {
          width: 100%;
          max-width: 400px;
          background: var(--dark2);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 40px;
        }

        /* 入力フィールドのラベル */
        .label {
          font-size: 10px;
          letter-spacing: 0.25em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }

        /* 入力フィールド */
        .input {
          width: 100%;
          background: var(--dark3);
          border: 1px solid var(--border);
          border-radius: 2px;
          color: var(--text);
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-size: 14px;
          padding: 14px 16px;
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 24px;
        }
        .input::placeholder { color: var(--text-muted); }
        .input:focus { border-color: var(--gold); }

        /* エラーメッセージ */
        .error-msg {
          font-size: 12px;
          color: var(--error);
          margin-bottom: 20px;
          text-align: center;
        }

        /* ログインボタン */
        .btn {
          width: 100%;
          padding: 18px;
          background: transparent;
          border: 1px solid var(--gold);
          color: var(--gold);
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.25s;
        }
        .btn:hover:not(:disabled) {
          background: var(--gold-dim);
          color: var(--gold-light);
        }
        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <div className="login-wrapper">
        {/* ヘッダー */}
        <header className="login-header">
          <div className="header-line" />
          <p className="header-eyebrow">FB5000 — Budget Ad Technologies</p>
          <h1 className="header-title">ログイン</h1>
        </header>

        {/* ログインカード */}
        <div className="login-card">
          {/* メールアドレス入力 */}
          <label className="label">メールアドレス</label>
          <input
            className="input"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)} // 入力のたびにstateを更新
          />

          {/* パスワード入力 */}
          <label className="label">パスワード</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)} // 入力のたびにstateを更新
          />

          {/* エラーメッセージ（エラーがある場合のみ表示） */}
          {error && <p className="error-msg">{error}</p>}

          {/* ログインボタン */}
          <button
            className="btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "ログイン中..." : "ログインする"}
          </button>
        </div>
      </div>
    </>
  )
}