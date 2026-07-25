# My Portfolio Creator JSON Schema Guide v2.0

職務経歴をMy Portfolio Creator用JSONへ変換するための完全なデータ構成と、各要素に入れる内容の説明です。

## 基本ルール

- ルートと各オブジェクトの項目はすべて記載します。
- `schemaVersion` は必ず `"2.0"` にします。
- 記載されていない事実・数値・顧客名・利用技術は推測しません。
- 不明な文字列は `""`、不明または該当なしの一覧は `[]`、不明な実務年数は `null` にします。
- 顧客名や所属名を公開できない場合は、業界・企業種別・案件種別など公開可能な粒度で `organizationLabel` に記載します。
- `careerEntries[].id` と `projects[].id` は、JSON内で重複しない安定した文字列にします。
- AIはJSONだけを出力し、Markdownコードブロックを付けません。

## フルスキーマ構成

次の構成ですべての項目を出力します。配列内のオブジェクトは必要な数だけ追加し、該当する情報がない配列は空配列にします。

```json
{
  "schemaVersion": "2.0",
  "profile": {
    "documentTitle": "",
    "name": "",
    "nameReading": "",
    "professionalTitle": "",
    "tagline": "",
    "affiliation": ""
  },
  "summary": {
    "statement": "",
    "experienceDomains": [],
    "coreCapabilities": [],
    "coreTechnologies": [],
    "availableRoles": [],
    "qualificationHighlights": []
  },
  "careerEntries": [
    {
      "id": "",
      "period": {
        "from": "",
        "to": ""
      },
      "role": "",
      "organizationLabel": "",
      "industry": "",
      "summary": "",
      "highlights": []
    }
  ],
  "projects": [
    {
      "id": "",
      "title": "",
      "period": {
        "from": "",
        "to": ""
      },
      "role": "",
      "organizationLabel": "",
      "summary": "",
      "background": "",
      "responsibilities": [],
      "process": [
        {
          "label": "",
          "description": ""
        }
      ],
      "approaches": [],
      "deliverables": [],
      "achievements": [
        {
          "statement": "",
          "metric": "",
          "evidence": ""
        }
      ],
      "technologies": [],
      "team": {
        "size": "",
        "position": ""
      },
      "visuals": [
        {
          "type": "",
          "title": "",
          "src": "",
          "alt": ""
        }
      ],
      "layoutHint": "auto"
    }
  ],
  "skills": {
    "categories": [
      {
        "name": "",
        "items": [
          {
            "name": "",
            "proficiency": "core",
            "experienceYears": null,
            "lastUsed": "",
            "contexts": []
          }
        ]
      }
    ]
  },
  "strengths": [
    {
      "title": "",
      "description": "",
      "evidence": "",
      "relatedProjectIds": []
    }
  ],
  "certifications": [
    {
      "name": "",
      "acquiredAt": "",
      "issuer": ""
    }
  ],
  "futureInterests": [],
  "presentation": {
    "theme": "business-navy",
    "pageSize": "A4-landscape",
    "sectionOrder": [
      "title",
      "summary",
      "career",
      "projects",
      "skills",
      "strengths",
      "direction"
    ]
  }
}
```

## `schemaVersion`

- 型: 文字列
- 値: 必ず `"2.0"`
- 用途: アプリがデータ形式を識別するためのバージョンです。

## `profile`

表紙に表示する本人情報です。

- `documentTitle`: 文字列。資料の名称です。例: `"キャリアシート"`、`"ポートフォリオ"`。
- `name`: 文字列。表示する氏名です。
- `nameReading`: 文字列。氏名の読み方です。ひらがな・カタカナ・ローマ字のいずれでも構いません。
- `professionalTitle`: 文字列。職種や専門領域を短く表します。例: `"バックエンドエンジニア / 業務システム開発"`。
- `tagline`: 文字列。強みや提供価値を一文で表すキャッチコピーです。経歴から確認できる内容にします。
- `affiliation`: 文字列。現在の所属、部門、雇用形態など、公開可能な所属情報です。

## `summary`

読み手が人物像を短時間で理解するための要約です。プロジェクト詳細の単なる繰り返しではなく、経歴全体を横断してまとめます。

- `statement`: 文字列。経験年数、主な領域、担当範囲、得意分野などを含む全体要約です。確認できない年数は書きません。
- `experienceDomains`: 文字列の配列。経験した業界・業務領域・システム種別です。例: `"製造業向けデータ活用"`。
- `coreCapabilities`: 文字列の配列。要件整理、設計、実装、運用改善など、実務で発揮してきた能力です。
- `coreTechnologies`: 文字列の配列。経歴全体を代表する主力技術です。使用実績が確認できるものだけを記載します。
- `availableRoles`: 文字列の配列。現在対応できる役割や業務です。将来やりたいことは含めません。
- `qualificationHighlights`: 文字列の配列。特に伝えたい資格、認定、研修修了などです。詳細は `certifications` に記載します。

## `careerEntries`

キャリアの時系列です。所属、役割、案件区分など、経歴上のまとまりごとに1要素を作成します。

- 型: オブジェクトの配列
- `id`: 文字列。このキャリア項目を識別する一意なIDです。例: `"career-1"`。
- `period.from`: 文字列。開始時期です。元情報に合わせて `"2022.04"`、`"2022年4月"` など一貫した形式にします。
- `period.to`: 文字列。終了時期です。継続中の場合は `"現在"`、不明な場合は `""` にします。
- `role`: 文字列。その期間の職種、役割、職位です。
- `organizationLabel`: 文字列。公開可能な所属・顧客・案件種別です。機密名は一般化します。
- `industry`: 文字列。業界、事業領域、業務領域です。
- `summary`: 文字列。その期間に担当した仕事の概要です。
- `highlights`: 文字列の配列。代表的な実績、担当内容、変化を簡潔に記載します。

## `projects`

具体的なプロジェクトや案件の詳細です。1つの案件につき1要素を作成し、入力項目は表示レイアウトにかかわらず同じ構成にします。

- 型: オブジェクトの配列
- `id`: 文字列。このプロジェクトを識別する一意なIDです。例: `"project-1"`。`strengths[].relatedProjectIds` から参照します。
- `title`: 文字列。内容が伝わるプロジェクト名です。機密名は使わず、目的や対象が分かる一般名にします。
- `period.from`: 文字列。開始時期です。
- `period.to`: 文字列。終了時期です。継続中の場合は `"現在"` にします。
- `role`: 文字列。プロジェクト内での役割です。例: `"開発担当"`、`"テックリード"`。
- `organizationLabel`: 文字列。公開可能な顧客区分、所属部門、案件種別です。
- `summary`: 文字列。何を目的に何を作ったかが分かる短い概要です。
- `background`: 文字列。着手前の状況、課題、依頼の背景、解決すべき理由です。
- `responsibilities`: 文字列の配列。本人が担当した範囲です。チーム全体の実施内容と混同しません。
- `process`: オブジェクトの配列。要件整理、設計、実装、テスト、運用などの工程と、各工程で行ったことです。
- `process[].label`: 文字列。工程名です。例: `"要件整理"`。
- `process[].description`: 文字列。その工程で本人が実施した内容です。
- `approaches`: 文字列の配列。課題に対する工夫、判断、設計上の配慮、改善方法です。
- `deliverables`: 文字列の配列。作成したシステム、機能、設計書、手順書などの成果物です。
- `achievements`: オブジェクトの配列。プロジェクトによって生じた成果です。
- `achievements[].statement`: 文字列。成果や変化を文章で記載します。
- `achievements[].metric`: 文字列。確認できる定量値だけを記載します。数値がなければ `""` にします。
- `achievements[].evidence`: 文字列。比較方法、測定記録、利用者の反応など、成果の根拠です。根拠がなければ `""` にします。
- `technologies`: 文字列の配列。本人が実際に使用した言語、フレームワーク、クラウド、データベース、ツールです。
- `team.size`: 文字列。チーム人数や体制です。例: `"5名"`。不明なら `""` にします。
- `team.position`: 文字列。チーム内での立場や責任です。
- `visuals`: オブジェクトの配列。掲載する画面、構成図、成果物画像などです。画像がない場合は `[]` にします。
- `visuals[].type`: 文字列。画像の種類です。例: `"screenshot"`、`"architecture"`、`"diagram"`。
- `visuals[].title`: 文字列。画像の見出しです。
- `visuals[].src`: 文字列。画像のURLまたはデータURLです。
- `visuals[].alt`: 文字列。画像が見えない場合にも内容が伝わる代替テキストです。
- `layoutHint`: 文字列。表示レイアウトの希望です。`"auto"`、`"full"`、`"compact"`、`"visual"` のいずれかです。

## `projects[].layoutHint`

- `"auto"`: 判断できない場合の標準値です。アプリが情報量に応じて選択します。
- `"full"`: 背景、担当範囲、工程、工夫、成果が十分にあり、詳細を見せたい案件です。
- `"compact"`: 小規模・短期間、または情報が少なく、概要と成果を中心に見せる案件です。
- `"visual"`: 画面や構成図を主役にする案件です。`visuals` が空の場合はアプリが別レイアウトへフォールバックします。

## `skills`

技術や知識をカテゴリ別に整理します。星や5段階評価ではなく、実務での位置づけを `proficiency` で示します。

- `categories`: スキルカテゴリの配列です。
- `categories[].name`: 文字列。カテゴリ名です。例: `"プログラミング言語"`、`"クラウド"`。
- `categories[].items`: そのカテゴリに属するスキルの配列です。
- `categories[].items[].name`: 文字列。技術、製品、手法などの名称です。
- `categories[].items[].proficiency`: 文字列。`"core"`、`"working"`、`"basic"` のいずれかです。
- `categories[].items[].experienceYears`: 数値または `null`。確認できる実務経験年数です。推測せず、不明なら `null` にします。
- `categories[].items[].lastUsed`: 文字列。最後に実務や学習で使用した時期です。継続利用中は `"現在"`、不明なら `""` にします。
- `categories[].items[].contexts`: 文字列の配列。その技術を使った用途や場面です。例: `"データ処理"`、`"Web API"`。

## `skills.categories[].items[].proficiency`

- `"core"`: 主力として継続的に使い、自力で設計・実装・問題解決に活用できるものです。
- `"working"`: 実務で使用した経験があり、担当作業に活用できるものです。
- `"basic"`: 基礎知識、学習経験、限定的な利用経験があるものです。

## `strengths`

本人の強みと、その根拠を記載します。抽象的な自己評価だけにせず、経歴やプロジェクトと結び付けます。

- 型: オブジェクトの配列
- `title`: 文字列。強みを短く表す名称です。
- `description`: 文字列。その強みがどのような行動や価値として表れるかを説明します。
- `evidence`: 文字列。強みを裏付ける具体的な経験、行動、成果です。
- `relatedProjectIds`: 文字列の配列。根拠となる `projects[].id` を記載します。該当案件がなければ `[]` にします。

## `certifications`

資格、認定、試験合格などです。

- 型: オブジェクトの配列
- `name`: 文字列。資格・認定の正式名称です。
- `acquiredAt`: 文字列。取得時期です。分かる粒度で記載し、不明なら `""` にします。
- `issuer`: 文字列。発行元、認定団体、主催者です。

## `futureInterests`

- 型: 文字列の配列
- 内容: 今後取り組みたい技術、役割、業務領域です。
- 現在対応できることを示す `summary.availableRoles` や、実務経験を示す `skills` と混同しません。

## `presentation`

資料の表示設定です。通常は次の固定値と標準順序を使用します。

- `theme`: 文字列。必ず `"business-navy"` にします。
- `pageSize`: 文字列。必ず `"A4-landscape"` にします。
- `sectionOrder`: 文字列の配列。表示するセクションと順序です。同じ値を重複させません。
- `"title"`: 表紙。
- `"summary"`: 人物要約。
- `"career"`: キャリア年表。
- `"projects"`: プロジェクト詳細。
- `"skills"`: スキル。
- `"strengths"`: 強み。
- `"direction"`: 今後の注力分野。`futureInterests` の内容を表示します。

空のセクションはプレビューで省略されます。
