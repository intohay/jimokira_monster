import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* Twitter Card / OGP */}
        <meta name="twitter:card" content="summary_large_image" />
        {/* X (Twitter) アカウントを持っている場合は以下を設定 */}
        <meta name="twitter:site" content="@intohay" />

        <meta property="og:title" content="じもきらモンスター" />
        <meta
          property="og:description"
          content="音声を聞いて画像を当てるクイズゲーム！10問連続正解を目指そう！"
        />
        {/* デプロイ URL に合わせて絶対 URL を推奨 */}
        <meta
          property="og:image"
          content="https://jimokira-monster.vercel.app/ogp.png"
        />
        <meta
          property="og:url"
          content="https://jimokira-monster.vercel.app/"
        />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
