// NextAuthのミドルウェアをインポートする
export { default } from "next-auth/middleware"

// このミドルウェアを適用するページを指定する
// "/" → トップページ、"/api/generate" → APIルートを保護する
export const config = {
  matcher: ["/", "/api/generate"],
}