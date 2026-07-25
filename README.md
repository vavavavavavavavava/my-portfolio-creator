# My Portfolio Creator

AIとJSONを使って、面談用のキャリアシートを作成する静的Webアプリケーションです。入力内容はブラウザ内で編集・保存でき、A4横のPDFとして出力できます。

## 主な機能

- AI用プロンプトのコピー
- AI向けスキーマ説明ページと全文コピー
- 内容入りサンプルJSONのコピー
- 生成AIが出力したJSONの直接貼り付け・編集・読込
- 編集中データのJSONファイル保存・再読込
- 旧形式JSONからSchema v2への自動移行
- 職務要約、キャリア年表、プロジェクト、スキル、強み、資格の編集
- プロジェクトごとの `auto` / `full` / `compact` / `visual` レイアウト
- A4横で統一したプレビューとPDF出力
- JavaScript文字列ではなく、外部HTMLファイルによるテンプレート管理

## ページ

- `editor.html`: キャリア情報の編集、AI・JSON支援
- `preview.html`: A4横のキャリアシートプレビュー、PDF保存
- `schema.html`: AI向けJSONスキーマ説明と全文コピー

## ローカル起動

外部HTMLテンプレートを `fetch` で読み込むため、ファイルを直接開くのではなくHTTPサーバー経由で起動してください。

```bash
python -m http.server 8000
```

ブラウザで次を開きます。

```text
http://localhost:8000/editor.html
```

## JSON Schema v2

- 人が読む説明: `docs/schema-v2.md`
- 正式なJSON Schema: `schema/portfolio-v2.schema.json`
- 入力例: `examples/sample-portfolio.json`
- AI用プロンプト: `ai/prompt-template.txt`

スキーマの主な考え方は次のとおりです。

- `profile`: 表紙に表示する本人情報
- `summary`: 今から説明する人物の全体像
- `careerEntries`: 公開可能な粒度で記載するキャリア年表
- `projects`: レイアウトに依存しない共通プロジェクトデータ
- `skills`: `core` / `working` / `basic` の3段階評価
- `strengths`: 説明と根拠を持つ強み
- `presentation`: A4横と表示順

## テンプレート構成

動的な入力フォームとプレビューの各スライドは、`templates/**/*.html` にある標準HTML `<template>` から生成します。テンプレート内の空要素へJavaScriptが値を設定するため、デザイン変更とデータ処理を分離できます。

## ライセンス

MIT License
