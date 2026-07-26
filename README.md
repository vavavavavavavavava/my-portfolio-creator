# マイポートフォリオクリエイター

技術者向けのポートフォリオをブラウザで作成し、スライド形式で確認・PDF保存できるWebアプリです。

[アプリを開く](https://my-portfolio-creator.pages.dev/) / [作成ガイド](./docs/guide.md)

## 主な機能

- 職歴、プロジェクト、スキル、強み、資格の編集
- JSONの読み込み・編集・ダウンロード
- 生成AI用プロンプトのコピー
- プロジェクト画像の追加
- スライドプレビューとPDF保存

JSON内の文字を `**このように**` 囲むと、プレビューで赤い太字として強調されます。

## ローカルで使う

このリポジトリを取得し、ルートディレクトリでWebサーバーを起動します。

```bash
git clone https://github.com/vavavavavavavavava/my-portfolio-creator.git
cd my-portfolio-creator
python -m http.server 8000
```

ブラウザで `http://localhost:8000/editor.html` を開いてください。ファイルを直接開くと、一部の読み込み処理が動作しない場合があります。

## 基本的な使い方

1. 各タブで経歴やスキルを入力する
2. 「スライドプレビュー」で表示を確認する
3. プレビュー画面の「PDFで保存」から印刷ダイアログを開く
4. 出力先をPDFに設定して保存する

生成AIで下書きを作る場合は、[作成ガイド](./docs/guide.md) を参照してください。

## データと構成

保存データは `schemaVersion: 2` のJSONです。表示用テンプレートは `templates/preview/` にあり、レイアウト設定と経歴データを分離しています。

主なファイルは次のとおりです。

- `editor.html`: データの入力・編集
- `preview.html`: プレビューとPDF保存
- `js/`: 編集、保存、描画処理
- `css/`: エディタ、プレビュー、印刷用スタイル
- `templates/`: 入力フォームとプレビューのテンプレート

## デバッグログ

`.env.example` を `.env` にコピーし、`DEBUG_MODE=true` にするとコンソールログが有効になります。変更後はページを再読み込みしてください。

## ライセンス

[MIT License](./LICENSE)
