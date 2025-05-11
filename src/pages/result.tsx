import { useRouter } from "next/router";
import Link from "next/link";

export default function Result() {
  const router = useRouter();
  const { score, total } = router.query as { score?: string; total?: string };
  const scoreNum = parseInt(score ?? "0", 10);
  const totalNum = parseInt(total ?? "0", 10);

  const tweetText = encodeURIComponent(
    `じもきらモンスター 結果: ${scoreNum}/${totalNum} 正解!\n#じもきらモンスター\nhttps://jimokira-monster.vercel.app/`
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6 text-center">
      <h1 className="text-3xl font-bold">結果発表</h1>
      <p className="text-xl">
        {total ? (
          <>
            {totalNum} 問中 {scoreNum} 問正解 🎉
          </>
        ) : (
          "結果がありません"
        )}
      </p>
      <div className="flex gap-4">
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          X（Twitter）で共有
        </a>
        <Link
          href="/"
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          もう一度遊ぶ
        </Link>
      </div>
    </div>
  );
} 