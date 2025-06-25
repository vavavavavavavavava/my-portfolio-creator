# CLAUDE.md の日本語要約

このリポジトリは**日本語のポートフォリオ作成ツール**で、主に2つのコンポーネントから構成されています。

* **エディター（editor.html）**: ポートフォリオデータを作成するためのインタラクティブなフォームベースのエディター
* **プレビュー（preview\.html）**: ポートフォリオデータを視覚的に表示し、PDFにエクスポートできるビジュアルレンダラー

アプリケーションは**純粋なクライアントサイドのJavaScriptアプリ**で、ビルド工程はなく、すべてのファイルをそのままブラウザに提供します。

---

## アーキテクチャ

### 基本構成

* **静的HTMLファイル**: `index.html`（エディターへリダイレクト）、`editor.html`、`preview.html`
* **モジュール化されたJavaScript**:

  * 共通処理は `js/common/`
  * エディター用は `js/editor/`
  * プレビュー用は `js/preview/`
* **テンプレートシステム**: Handlebars.jsを利用し、テンプレートは`templates/editor/`と`templates/preview/`に分離
* **CSS**: `css/common/`、`css/editor/`、`css/preview/`で機能別に分割

---

### 主なモジュール

#### 共通（js/common/）

* `config.js`: アプリ設定と環境検出
* `env-loader.js`: `.env`ファイルから環境変数を読み込み
* `utils.js`: JSONのパースやバリデーション
* `notification.js`: トースト通知
* `templates.js`: テンプレートの読み込み管理

#### エディター用（js/editor/）

* `main.js`: 初期化・全体オーケストレーション
* `form-manager.js`: 動的フォーム管理
* `json-handler.js`: JSON入出力
* `ui-controller.js`: タブやUI操作
* `dialog-manager.js`: ダイアログ・モーダル管理
* `image-uploader.js`: 画像アップロード

#### プレビュー用（js/preview/）

* `main.js`: プレビュー初期化・エラー処理
* `renderer.js`: テンプレート描画、スライド生成

---

### データフロー

1. **エディター**: ユーザーがフォーム入力 → JSONとしてエクスポート/保存
2. **プレビュー**: JSONデータ → Handlebarsテンプレートでレンダリング → ビジュアル表示
3. **エディターとプレビューの連携**: sessionStorageでデータをやりとり

---

### テンプレートシステム

* Handlebars.jsでテンプレート管理
* エディター用・プレビュー用でテンプレートを分離
* `TemplateManager.loadAllTemplates()` で動的に読み込み

---

## 開発コマンド

### ローカル開発

```bash
# ローカルサーバーでファイルを配信
python -m http.server 8000
# または
npx serve .
```

### 環境設定

```bash
# .env テンプレートをコピー
cp .env.example .env
# .envでDEBUG_MODE（true/false）を編集
```

### ファイルの配信

* `editor.html`を直接ブラウザで開く、またはローカルサーバー経由でアクセス
* デバッグはブラウザの開発者ツールで（DEBUG\_MODEで制御）

---

## コードパターン

* **IIFE（即時実行関数式）パターン**で各JSモジュールを構築
* テンプレートは利用前に必ずロード
* JSONパースは`Utils.parseJson()`で安全に
* エラー通知は`Notification.error()`/`Notification.success()`で実装
* コンソールログは`Config.DEBUG_MODE`で制御

---

## よくある作業

* **新しいフォームフィールド追加**

  * `templates/editor/[section].js`と`templates/preview/[section].js`を修正
  * 動的動作が必要ならform managerも修正

* **スタイル変更**

  * `css/editor/`, `css/preview/`, `css/common/`を編集
  * PDF用は`css/common/print.css`

* **データ構造変更**

  * 両テンプレートを修正
  * JSON入出力をテスト
  * sessionStorageでのデータ保持も確認

---

## その他の注意点

* `package.json`やビルドシステムは**無し**（シンプルさを重視）
* 依存ライブラリはCDN経由（現状Handebars.jsのみ）
* UI・コメントは全て日本語
* PDFエクスポートはブラウザの印刷機能＋print用CSSで実現
