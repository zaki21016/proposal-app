"use client" // ブラウザ側で動くコードという宣言

import { useState } from "react" // 画面の状態を管理するReactの機能

export default function Home() {
  const [minutes, setMinutes] = useState("")   // 入力された議事録テキスト
  const [proposal, setProposal] = useState("") // 生成された提案書テキスト
  const [loading, setLoading] = useState(false) // 生成中かどうかのフラグ

  // ボタンを押したときに実行される関数
  async function handleGenerate() {
    if (!minutes.trim()) return // 空のまま送信を防ぐ
    setLoading(true)
    setProposal("") // 前回の結果をリセット

    // APIルートにPOSTリクエストを送る
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minutes }) // 議事録テキストを送信
    })

    const data = await res.json() // レスポンスをJSONで受け取る
    setProposal(data.proposal)   // 提案書テキストをセット
    setLoading(false)            // ローディング状態を解除
  }

  return (
    <>
      {/* グローバルスタイル：フォントとベースデザインの定義 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');

        /* CSS変数：色とフォントを一元管理 */
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
        }

        /* ベースリセットとフォント設定 */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: var(--dark);
          color: var(--text);
          font-family: 'Zen Kaku Gothic New', sans-serif;
          min-height: 100vh;
        }

        /* ページ全体のコンテナ */
        .wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 24px;
          background:
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%),
            var(--dark);
        }

        /* ロゴ・タイトルエリア */
        .header {
          text-align: center;
          margin-bottom: 56px;
        }

        /* 上部の細いゴールドライン */
        .header-line {
          width: 48px;
          height: 1px;
          background: var(--gold);
          margin: 0 auto 24px;
        }

        /* サービス名 */
        .header-eyebrow {
          font-size: 11px;
          letter-spacing: 0.3em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        /* メインタイトル */
        .header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 600;
          line-height: 1.2;
          color: var(--text);
          margin-bottom: 12px;
        }

        /* サブタイトル */
        .header-sub {
          font-size: 13px;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        /* メインカード */
        .card {
          width: 100%;
          max-width: 760px;
          background: var(--dark2);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 40px;
        }

        /* セクションラベル */
        .label {
          font-size: 10px;
          letter-spacing: 0.25em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        /* 議事録入力テキストエリア */
        .textarea {
          width: 100%;
          min-height: 200px;
          background: var(--dark3);
          border: 1px solid var(--border);
          border-radius: 2px;
          color: var(--text);
          font-family: 'Zen Kaku Gothic New', sans-serif;
          font-size: 14px;
          line-height: 1.8;
          padding: 20px;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
        }
        .textarea::placeholder { color: var(--text-muted); }
        .textarea:focus { border-color: var(--gold); }

        /* ゴールドの区切り線 */
        .divider {
          width: 100%;
          height: 1px;
          background: var(--border);
          margin: 32px 0;
        }

        /* 生成ボタン */
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
          position: relative;
          overflow: hidden;
        }
        .btn:hover:not(:disabled) {
          background: var(--gold-dim);
          color: var(--gold-light);
        }
        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* ローディングアニメーション */
        .dots::after {
          content: '';
          animation: dots 1.2s steps(4, end) infinite;
        }
        @keyframes dots {
          0%   { content: ''; }
          25%  { content: '.'; }
          50%  { content: '..'; }
          75%  { content: '...'; }
        }

        /* 生成結果エリア */
        .result {
          margin-top: 40px;
          padding: 32px;
          background: var(--dark3);
          border: 1px solid var(--border);
          border-radius: 2px;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.9;
          color: var(--text);
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* 結果ヘッダー */
        .result-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        /* ゴールドのドット装飾 */
        .result-dot {
          width: 6px;
          height: 6px;
          background: var(--gold);
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* フッター */
        .footer {
          margin-top: 48px;
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-align: center;
        }
      `}</style>

      <div className="wrapper">
        {/* ヘッダーエリア */}
        <header className="header">
          <div className="header-line" />
          <p className="header-eyebrow">FB5000 — Budget Ad Technologies</p>
          <h1 className="header-title">提案書自動生成</h1>
          <p className="header-sub">商談議事録から、最適な提案書を即時生成します</p>
        </header>

        {/* メインカード */}
        <main className="card">
          <p className="label">議事録を入力</p>

          {/* 議事録入力欄 */}
          <textarea
            className="textarea"
            placeholder="商談内容、課題、予算、担当者名などを入力してください..."
            value={minutes}
            onChange={e => setMinutes(e.target.value)} // 入力のたびにstateを更新
          />

          <div className="divider" />

          {/* 生成ボタン */}
          <button
            className="btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading
              ? <span className="dots">提案書を生成中</span>
              : "提案書を生成する"
            }
          </button>

          {/* 生成結果の表示（提案書がある場合のみ表示） */}
          {proposal && (
            <div className="result">
              <div className="result-header">
                <div className="result-dot" />
                <span className="label" style={{margin: 0}}>生成された提案書</span>
              </div>
              {proposal}
            </div>
          )}
        </main>

        {/* フッター */}
        <footer className="footer">
          © 2026 Budget Ad Technologies — FB5000
        </footer>
      </div>
    </>
  )
}