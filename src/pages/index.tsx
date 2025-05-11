import { GetStaticProps } from "next";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import path from "path";
import fs from "fs";

interface Item {
  base: string;
  audio: string;
  image: string;
}

interface Question {
  audio: string;
  options: { src: string; title: string; isCorrect: boolean }[];
}

interface Props {
  items: Item[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const audioDir = path.join(process.cwd(), "public", "audio");
  const imgDir = path.join(process.cwd(), "public", "img");

  const audioFiles = fs.existsSync(audioDir) ? fs.readdirSync(audioDir) : [];
  const imgFiles = fs.existsSync(imgDir) ? fs.readdirSync(imgDir) : [];

  const items: Item[] = audioFiles
    .map((filename) => {
      const base = filename.replace(/\.[^.]+$/, "");
      const imageFile = imgFiles.find((f) => f.startsWith(base + ".")) ?? "";
      if (!imageFile) return null;
      return {
        base,
        audio: `/audio/${filename}`,
        image: `/img/${imageFile}`,
      } as Item;
    })
    .filter(Boolean) as Item[];

  return {
    props: { items },
  };
};

export default function Game({ items }: Props) {
  const router = useRouter();
  const total = 10;
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!items.length) return;
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(total, shuffled.length));
    const qs = selected.map((item) => {
      let other: Item;
      do {
        other = items[Math.floor(Math.random() * items.length)];
      } while (other.base === item.base && items.length > 1);

      const options = [
        { src: item.image, title: item.base, isCorrect: true },
        { src: other.image, title: other.base, isCorrect: false },
      ].sort(() => Math.random() - 0.5);

      return {
        audio: item.audio,
        options,
      } as Question;
    });
    setQuestions(qs);
  }, [items]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = questions[currentIdx];

  useEffect(() => {
    if (answered) {
      const timer = setTimeout(() => {
        if (currentIdx + 1 < questions.length) {
          setCurrentIdx((i) => i + 1);
          setAnswered(false);
        } else {
          router.push({
            pathname: "/result",
            query: { score, total: questions.length },
          });
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [answered, currentIdx, questions.length, router, score]);

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <p>データがありません。public/audio と public/img にファイルを配置してください。</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <p>ロード中…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <h1 className="text-2xl font-bold">じもきらモンスター</h1>
      <p>
        問題 {currentIdx + 1} / {questions.length}
      </p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        onClick={() => audioRef.current?.play()}
      >
        音声を聞く
      </button>
      <audio ref={audioRef} src={current.audio} preload="auto" />

      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (answered) return;
              setAnswered(true);
              if (opt.isCorrect) setScore((s) => s + 1);
            }}
            className={`flex flex-col items-center border-4 rounded-lg overflow-hidden transition-all duration-200 ${
              answered
                ? opt.isCorrect
                  ? "border-green-500"
                  : "border-red-500"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <Image
              src={opt.src}
              alt={opt.title}
              width={300}
              height={300}
              className="object-cover w-full h-auto"
            />
            <span className="py-2 text-center w-full bg-gray-100 dark:bg-gray-800">
              {opt.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
