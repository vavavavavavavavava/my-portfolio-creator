// defaultData.js - デフォルトのJSONデータ

// デフォルトデータを定義
const DEFAULT_DATA = {
    "title": {
      "name": "山田 太郎",
      "nameReading": "やまだ たろう",
      "company": "株式会社テックソリューションズ"
    },
    "career": {
      "careerHistory": [
        {
          "period": {
            "from": "2018/04",
            "to": "2021/03"
          },
          "role": "ソフトウェアエンジニア",
          "company": "株式会社イノベーションテック",
          "description": "画像処理と機械学習を利用したソフトウェア開発に従事。チーム内のアルゴリズム設計、実装、テストを担当。",
          "projects": [
            "自動検査システム開発",
            "画像認識AIモデルの設計"
          ]
        },
        {
          "period": {
            "from": "2021/04",
            "to": "現在"
          },
          "role": "AIエンジニア",
          "company": "株式会社テックソリューションズ",
          "description": "ROS2と強化学習を活用した自律走行システムの研究開発を担当。開発チームを技術的にリード。",
          "projects": [
            "強化学習ベースの自律RCカー開発",
            "リアルタイム画像処理パイプラインの構築"
          ]
        }
      ]
    },
    "skills": {
      "categories": [
        {
          "categoryName": "プログラミング言語",
          "items": [
            { "name": "Python", "level": 3 },
            { "name": "C++", "level": 2 },
            { "name": "JavaScript", "level": 2 }
          ]
        },
        {
          "categoryName": "フレームワーク・ツール",
          "items": [
            { "name": "ROS2", "level": 3 },
            { "name": "PyTorch", "level": 3 },
            { "name": "OpenCV", "level": 3 },
            { "name": "Vite", "level": 2 }
          ]
        }
      ],
      "skillLevelLabels": [
        "初級",
        "中級",
        "上級"
      ]
    },
    "strengths": {
      "strengths": [
        {
          "title": "画像処理・機械学習の専門知識",
          "description": "画像処理技術とAIを活用し、効率的で高精度なアルゴリズムを開発可能。"
        },
        {
          "title": "迅速なプロトタイピング能力",
          "description": "短期間でプロトタイプを作成し、フィードバックに基づいて迅速に改善を実施。"
        }
      ],
      "futureFocus": [
        "自律走行分野での先進技術研究",
        "深層強化学習技術の応用展開"
      ],
      "certifications": [
        "JDLA Deep Learning for ENGINEER 2022 #123456",
        "ROS2 Advanced Developer Certification"
      ]
    },
    "technicalcareer": [
      {
        "projectTitle": "自律走行RCカーの開発",
        "flowTitle": "役割の変遷",
        "roleMilestones": [
          {"label": "PG", "role": "プログラマー", "date": "2021年4月", "description": "バックエンド開発担当。APIの設計と実装を中心に行う"},
          {"label": "SE", "role": "システムエンジニア", "date": "2021年9月", "description": "要件定義から実装まで担当。顧客との調整業務も実施"},
          {"label": "TL", "role": "テックリード", "date": "2022年2月", "description": "開発チームの技術面をリード。アーキテクチャ設計を担当"}
        ],
        "techStack": ["Python", "ROS2", "PyTorch", "OpenCV", "Vite"],
        "overviewTitle": "強化学習を活用した自律RCカーシステム",
        "overviewText": "オンボードカメラから取得した画像データを基に強化学習モデルがリアルタイムで走行制御を行うシステムを開発。実環境での走行テストを繰り返し、精度向上を実現した。",
        "achievements": [
          "走行精度を初期比50%向上",
          "画像処理パイプラインの処理速度30%改善"
        ],
        "illustrationImage": "https://example.com/image/rc_car_project.png"
      }
    ]
  };
  
  // グローバル変数として公開
  window.DEFAULT_DATA = DEFAULT_DATA;