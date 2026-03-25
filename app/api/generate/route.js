// POSTリクエストを受け取る関数を定義（外部から呼び出せるようにexportする）
export async function POST(request) {

    // ブラウザから送られてきたJSONデータを取り出す（minutesが議事録テキスト）
    const { minutes } = await request.json()
  
    // Claude APIのエンドポイントにリクエストを送る
    const response = await fetch("https://api.anthropic.com/v1/messages", {
  
      // データを送信するのでPOSTを指定
      method: "POST",
  
      headers: {
        // 送るデータの形式がJSONであることを宣言
        "Content-Type": "application/json",
  
        // .env.localに保存したAPIキーを読み込む（コードに直接書かない）
        "x-api-key": process.env.ANTHROPIC_API_KEY,
  
        // AnthropicのAPIバージョンを指定（必須項目）
        "anthropic-version": "2023-06-01",
      },
  
      // 実際に送るデータをJSON文字列に変換して渡す
      body: JSON.stringify({
  
        // 使用するClaudeのモデルを指定
        model: "claude-sonnet-4-20250514",
  
        // Claudeが返す文章の最大長（トークン数）
        max_tokens: 2000,
  
        messages: [{
          // 「ユーザーからのメッセージ」として送ることを指定
          role: "user",
  
          // Claudeに渡すプロンプト。${minutes}の部分に議事録テキストが入る
          content: `以下は商談の議事録です。FB5000の提案書を作成してください。
  
  【議事録】
  ${minutes}
  
  【出力形式】
  ・会社名・担当者名
  ・現状の課題
  ・FB5000で解決できること
  ・推奨プラン・料金
  ・期待できる成果
  ・次のアクション`
        }]
      })
    })
  
    // Claudeからの返答をJSONとして受け取る
    const data = await response.json()
  
    // 返答の中からテキスト部分だけを取り出す（contentの1番目の要素のtext）
    const proposal = data?.content?.[0]?.text
  
    // 取り出した提案書テキストをブラウザに返す
    return Response.json({ proposal })
  }