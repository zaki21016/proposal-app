// Next.jsのサーバーサイドユーティリティをインポートする
import { NextResponse } from "next/server"

// NextAuthのJWTトークンを取得する関数をインポートする
import { getToken } from "next-auth/jwt"

// proxy関数：すべてのリクエストをここで検査する
export async function proxy(request) {

  // リクエストからJWTトークンを取得する（ログイン済みかどうかの確認）
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // トークンの内容をターミナルに出力する（確認用）
  console.log("token:", token, "path:", request.nextUrl.pathname)

  // 現在のURLパスを取得する
  const { pathname } = request.nextUrl

  // ログインページへのアクセスは常に許可する
  if (pathname.startsWith("/login")) {
    return NextResponse.next()
  }

  // NextAuthの内部APIへのアクセスは常に許可する
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // トークンがない（未ログイン）場合はログインページに飛ばす
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // ログイン済みの場合はそのままアクセスを許可する
  return NextResponse.next()
}

// このproxyを適用するページを指定する
export const config = {
  matcher: ["/", "/api/generate"],
}