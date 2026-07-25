# My Portfolio Creator JSON Schema Guide v2.0

AIまたは利用者が、職務経歴をMy Portfolio Creator用JSONへ変換するための仕様です。

## 最重要ルール

- `schemaVersion` は必ず `"2.0"`。
- 記載されていない事実・数値・顧客名・利用技術を推測しない。
- 顧客名を出せない場合は `organizationLabel` を「自動車メーカー系」「製造業向け案件」など公開可能な粒度にする。
- 不明な文字列は空文字、一覧は空配列、実務年数は `null`。
- プロジェクトの項目はレイアウトによって変えない。
- AIはJSONだけを出力し、Markdownコードブロックを付けない。

## ルート構造

```json
{
  "schemaVersion": "2.0",
  "profile": {},
  "summary": {},
  "careerEntries": [],
  "projects": [],
  "skills": { "categories": [] },
  "strengths": [],
  "certifications": [],
  "futureInterests": [],
  "presentation": {}
}
```

## 各セクション

- `profile`: 表紙。氏名、読み、職種・専門領域、キャッチコピー、所属。
- `summary`: 今から話す人物の要約。経験領域、得意工程、コア技術、対応可能な役割。
- `careerEntries`: キャリア年表。期間、役割、公開可能な所属表記、概要、主な実績。
- `projects`: プロジェクト詳細。期間、役割、背景、担当範囲、工程、工夫、成果物、成果、技術、チーム、画像。
- `skills`: 5段階評価を使わず、`core`（主力）、`working`（実務経験）、`basic`（基礎・学習）で表す。年数・最終利用・利用場面は任意。
- `strengths`: 強みの名称、説明、根拠となる経験、関連プロジェクトID。
- `certifications`: 資格名、取得時期、発行元。
- `futureInterests`: 今後の注力分野。現在できることと混同しない。

## プロジェクトのlayoutHint

- `auto`: 判断できない場合。アプリが情報量から選択。
- `full`: 背景・工程・工夫・成果が十分にある案件。
- `compact`: 小規模・短期間で、概要と成果を中心に見せる案件。
- `visual`: 画面・構成図などを主役にする案件。画像がなければアプリがフォールバックする。

成果の `metric` は確認できる数値だけ、`evidence` は比較方法や運用記録などの根拠だけを記載します。

## presentation

```json
{
  "theme": "business-navy",
  "pageSize": "A4-landscape",
  "sectionOrder": ["title", "summary", "career", "projects", "skills", "strengths", "direction"]
}
```

ページサイズはA4横固定です。空のセクションはプレビューで省略されます。
