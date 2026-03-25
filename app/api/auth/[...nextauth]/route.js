// NextAuthをインポートする
import NextAuth from "next-auth"

// メール＋パスワード認証のプロバイダーをインポートする
import CredentialsProvider from "next-auth/providers/credentials"

// 使用を許可するメールアドレスのリスト（ここに追加していく）
const ALLOWED_EMAILS = ["ayuki2000@icloud.com",
]

// NextAuthの設定オブジェクト
const authOptions = {
  // 認証方法の設定
  providers: [
    CredentialsProvider({
      // ログインフォームのフィールド定義
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },

      // ログイン時に実行される認証ロジック
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password

        // 許可リストにないメールアドレスは拒否する
        if (!ALLOWED_EMAILS.includes(email)) {
          return null
        }

        // 環境変数に設定したパスワードと一致するか確認する
        if (password !== process.env.APP_PASSWORD) {
          return null
        }

        // 認証成功：ユーザー情報を返す
        return { id: "1", email }
      },
    }),
  ],

  // ログインページのURLを指定する
  pages: {
    signIn: "/login",
  },

  // セッション管理の設定
  session: {
    strategy: "jwt",      // JWTトークンでセッションを管理する
    maxAge: 30 * 24 * 60 * 60, // セッションの有効期限：30日
  },

  // シークレットキーを環境変数から読み込む
  secret: process.env.NEXTAUTH_SECRET,
}

// GETとPOSTのリクエストを処理するハンドラーをエクスポートする
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }