#!/bin/bash

# 出力ディレクトリを作成 (存在しない場合のみ)
mkdir -p data/trimmed_img

# data/audio 内の .m4a ファイルをループ処理
for filepath in data/img/*.webp; do
  # ファイル名を取得 (拡張子なし)
  filename_base=$(basename "$filepath" .webp)
  # 角括弧と中の文字列を削除 (例: " [xxxxxx]")
  filename_cleaned="${filename_base//\[*\]/}"
  # 出力ファイルパスを生成。末尾に _trimmed を追加
  output_filepath="data/trimmed_img/${filename_cleaned}.webp"
  
  # 新しいファイル名として保存
  mv "$filepath" "$output_filepath"
done

echo "処理が完了しました。" 