"use client"

import { useState } from "react"

export default function Home() {
  const [minutes, setMinutes] = useState("")
  const [proposal, setProposal] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minutes })
    })
    const data = await res.json()
    setProposal(data.proposal)
    setLoading(false)
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">提案書自動生成</h1>

      <textarea
        className="w-full h-48 border rounded p-3 mb-4"
        placeholder="議事録を貼り付けてください"
        value={minutes}
        onChange={e => setMinutes(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "生成中..." : "提案書を生成"}
      </button>

      {proposal && (
        <div className="mt-8 p-4 border rounded whitespace-pre-wrap">
          {proposal}
        </div>
      )}
    </main>
  )
}