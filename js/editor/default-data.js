/**
 * 初回表示でデザインを確認するためのサンプルデータ
 */
const DefaultPortfolioData = {
  create() {
    return {
      schemaVersion: 2,
      title: {
        name: '山田 太郎',
        nameReading: 'やまだ たろう',
        profession: 'ITエンジニア',
        company: '株式会社サンプルテック　システム開発部',
        headline: '業務理解から設計・実装・改善まで、**価値につなげる**エンジニアリング。'
      },
      career: [
        {
          period: { from: '2022.04', to: null },
          company: '株式会社イノベーションテック',
          role: 'シニアソフトウェアエンジニア',
          summary: '大規模データ可視化プラットフォームの設計・開発をリード。',
          highlights: ['処理時間を**60%削減**', '5名のチームをマネジメント']
        },
        {
          period: { from: '2020.04', to: '2022.03' },
          company: '株式会社データフュージョン',
          role: 'ソフトウェアエンジニア',
          summary: 'フロントエンドからバックエンドまで幅広く担当。',
          highlights: ['利用ユーザー数を**3倍**に拡大', 'CI/CDパイプラインを構築']
        },
        {
          period: { from: '2018.04', to: '2020.03' },
          company: '株式会社ソリューションズ',
          role: 'プログラマー',
          summary: '業務システムの開発・保守・運用を担当。',
          highlights: ['バッチ処理時間を**30%削減**', '設計レビューを通じて品質を改善']
        },
        {
          period: { from: '2016.04', to: '2018.03' },
          company: '株式会社テクノソリューション',
          role: 'システム開発エンジニア',
          summary: '小規模システムの開発・テストと運用支援に従事。',
          highlights: ['基本情報技術者試験を取得']
        }
      ],
      projects: [
        {
          title: '電池データ可視化システム開発',
          period: { from: '2024.04', to: '2025.03' },
          role: '開発担当',
          overview: '充放電試験データを可視化・分析するWebシステムを開発。データ取り込みからレポート出力までを一貫して行える環境を構築しました。',
          responsibilities: [
            '要件整理と画面設計',
            'FastAPIによるAPI実装',
            '分析ダッシュボードの構築',
            '運用改善と利用者支援'
          ],
          achievements: [
            '解析時間を月平均**60%削減**',
            'レポート作成工数を**40%削減**',
            '満足度評価**4.6/5.0**を達成',
            '安定稼働率**99.5%**を維持'
          ],
          techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Plotly', 'GitHub Actions'],
          image: ''
        }
      ],
      skills: [
        {
          category: 'プログラミング言語',
          items: [
            { name: 'Python', level: 'core' },
            { name: 'TypeScript', level: 'practical' },
            { name: 'SQL', level: 'core' },
            { name: 'Go', level: 'basic' }
          ]
        },
        {
          category: 'フレームワーク',
          items: [
            { name: 'FastAPI', level: 'core' },
            { name: 'React', level: 'practical' },
            { name: 'Next.js', level: 'practical' },
            { name: 'Pydantic', level: 'core' }
          ]
        },
        {
          category: 'データベース',
          items: [
            { name: 'PostgreSQL', level: 'core' },
            { name: 'MySQL', level: 'practical' },
            { name: 'Redis', level: 'practical' }
          ]
        },
        {
          category: 'クラウド / インフラ',
          items: [
            { name: 'AWS', level: 'practical' },
            { name: 'Docker', level: 'core' },
            { name: 'Terraform', level: 'basic' }
          ]
        },
        {
          category: '開発ツール',
          items: [
            { name: 'Git / GitHub', level: 'core' },
            { name: 'VS Code', level: 'core' },
            { name: 'Postman', level: 'practical' }
          ]
        },
        {
          category: 'BI / データ分析',
          items: [
            { name: 'Pandas', level: 'core' },
            { name: 'Tableau', level: 'practical' },
            { name: 'Jupyter', level: 'practical' }
          ]
        }
      ],
      strengths: {
        items: [
          {
            title: '課題整理力',
            description: '業務ヒアリングと現状分析を通じて、課題の本質を構造化し、解決アプローチを明確にします。'
          },
          {
            title: '実装推進力',
            description: '設計・開発・テスト・リリースまでを一貫して推進し、品質とスピードを両立します。'
          },
          {
            title: '可視化・分析力',
            description: 'データの収集から可視化までを設計し、**意思決定につながる情報**を提供します。'
          },
          {
            title: '関係者調整力',
            description: '多様なステークホルダーの認識を揃え、円滑なコミュニケーションで合意形成を促進します。'
          }
        ],
        focusAreas: ['生成AI活用', 'データ基盤', 'プロダクトマネジメント'],
        certifications: [
          { name: '基本情報技術者', acquiredAt: '2017' },
          { name: 'AWS SAA', acquiredAt: '2024' }
        ]
      }
    };
  }
};

window.DefaultPortfolioData = DefaultPortfolioData;
