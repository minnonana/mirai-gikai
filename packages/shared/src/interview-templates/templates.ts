import type { PromptOverridesByMode } from "../interview-prompts/sections";
import type { InterviewMode } from "../interview-prompts/types";

/**
 * 用途別のインタビューテンプレート。
 *
 * 管理画面で新しいインタビューを作るときに選び、質問・所要時間・AIの聞き方の
 * 初期値として使う。作成後は設定ごとに自由に編集できるので、ここを変えても
 * 既に作ったインタビューには影響しない。
 *
 * キーは DB の interview_template_enum と一致させる（テストで同期を確認している）。
 */
export const INTERVIEW_TEMPLATE_KEYS = [
  "post_use_survey",
  "street_interview",
  "needs_research",
  "blank",
] as const;

export type InterviewTemplateKey = (typeof INTERVIEW_TEMPLATE_KEYS)[number];

export type TemplateQuestion = {
  question: string;
  /** 回答を受けてから使う深掘りの目安 */
  followUpGuide?: string;
  /** 選択肢ボタン */
  quickReplies?: string[];
};

export type InterviewTemplate = {
  key: InterviewTemplateKey;
  /** 一覧やバッジに出す名前 */
  label: string;
  /** テンプレート選択画面の見出し */
  headline: string;
  /** AIが聞くことの説明（テンプレート選択画面用） */
  asks: string;
  /** 回答のまとめに入る項目（テンプレート選択画面用の説明） */
  summaryItems: string[];
  mode: InterviewMode;
  estimatedMinutes: number;
  /** 新規作成時に入れる回答者向け説明の雛形 */
  defaultDescription: string;
  questions: TemplateQuestion[];
  /** AIの聞き方（管理画面から上書きできる節の初期値） */
  promptOverrides: PromptOverridesByMode;
};

const COMMON_CAUTION_LINES = `- 丁寧で親しみやすい口調で話してください
- ユーザーの回答を尊重し、押し付けがましくならないようにしてください
- **1つのメッセージでは1つの論点だけを聞いてください。** 括弧書きや補足で別の論点を追加しないでください。
- **フォローアップ指針は、回答を得た後のフォローアップの指針です。** 最初の質問に混ぜず、ユーザーの回答を受けてから活用してください。
- **「なぜ」の多用を避ける**: 「なぜそう思うのですか？」ではなく「どのような背景で」「何がきっかけで」など柔らかい表現を使う`;

const POST_USE_SURVEY: InterviewTemplate = {
  key: "post_use_survey",
  label: "使用後の調査",
  headline: "イベントやプロダクトを使った人の感想を聞く",
  asks: "満足度 ／ 良かった点 ／ 改善してほしい点 ／ 人に勧めたいか",
  summaryItems: ["満足度（5段階）", "良かった点", "改善点", "推奨度"],
  mode: "loop",
  estimatedMinutes: 5,
  defaultDescription:
    "ご利用ありがとうございました。感想を、AIが会話形式でうかがいます。良かったところも、気になったところも、思ったままお聞かせください。",
  questions: [
    {
      question: "全体の満足度を、5段階で教えてください。",
      quickReplies: [
        "5 とても満足",
        "4 満足",
        "3 ふつう",
        "2 やや不満",
        "1 不満",
      ],
    },
    {
      question: "特に良かった点や、印象に残った場面はありましたか？",
      followUpGuide:
        "どの場面・どの機能だったか、どうして印象に残ったかを具体的に聞く",
    },
    {
      question:
        "逆に「ここはもう少しこうだったら」と感じたところはありますか？",
      followUpGuide:
        "困った場面を具体的に聞き、どうなっていれば良かったかを聞く",
    },
    {
      question: "家族や友人に勧めたいと思いますか？",
      quickReplies: ["ぜひ勧めたい", "勧めてもいい", "どちらとも言えない", "勧めない"],
      followUpGuide: "そう思った理由を1つ聞く",
    },
    {
      question: "最後に、ほかに伝えたいことがあれば自由にどうぞ。",
    },
  ],
  promptOverrides: {
    loop: {
      cautions: `## 注意事項
${COMMON_CAUTION_LINES}
- 利用した体験についての感想を聞くことに集中してください。運営者の代わりに謝罪したり、改善を約束したりしないでください`,
      stopCriteria: `## 深掘りの打ち切り基準
1つの質問への深掘りは1〜2回までにしてください。回答者は利用直後で短時間で答えたいと考えています。

- 具体的な場面や理由が1つ聞けたら、次の質問に進む
- 「特にない」と答えた場合は深追いせず、次の質問に進む
- 回答者が早く終えたいサインを出したら、残りの質問を簡潔に進める`,
    },
  },
};

const STREET_INTERVIEW: InterviewTemplate = {
  key: "street_interview",
  label: "街頭インタビュー",
  headline: "その場でQRを読んでもらい、短く聞く",
  asks: "年代・どこから来たか などの属性 ／ 設定した質問への答え。深掘りは1回まで",
  summaryItems: ["回答者の属性", "質問ごとの回答", "印象的なひとこと"],
  mode: "loop",
  estimatedMinutes: 3,
  defaultDescription:
    "3分ほどで終わる短いインタビューです。スマホで、選択肢を押すか自由に入力して答えてください。",
  questions: [
    {
      question: "まず、年代を教えてください。",
      quickReplies: ["10代", "20代", "30代", "40代", "50代", "60代以上"],
    },
    {
      question: "今日はどちらからいらっしゃいましたか？",
      quickReplies: ["地元・近所", "県内", "県外", "海外"],
    },
    {
      question: "（ここに聞きたいことを書きます）",
      followUpGuide: "答えの理由やきっかけを1回だけ聞く",
    },
  ],
  promptOverrides: {
    loop: {
      cautions: `## 注意事項
${COMMON_CAUTION_LINES}
- 回答者は外出先でスマホから答えています。1つのメッセージは短く、2文以内にしてください`,
      stopCriteria: `## 深掘りの打ち切り基準
回答者は立ち止まって短時間で答えています。深掘りは各質問につき1回までにしてください。

- 理由やきっかけが1つ聞けたら、すぐ次の質問に進む
- 短い答えでも、それで十分として受け止める
- 全体で3分程度に収まるよう進める`,
    },
  },
};

const NEEDS_RESEARCH: InterviewTemplate = {
  key: "needs_research",
  label: "ニーズ・顧客インサイト",
  headline: "困りごとと、本当に欲しいものを掘り下げる",
  asks: "最近困った場面 ／ 今どう工夫しているか ／ 解決したら何が変わるか",
  summaryItems: ["課題", "その背景", "今の工夫", "理想の状態", "印象的な発言"],
  mode: "loop",
  estimatedMinutes: 10,
  defaultDescription:
    "日ごろの困りごとや工夫について、AIが会話形式でじっくりうかがいます。正解はありません。普段のことを思い出しながら、気軽にお話しください。",
  questions: [
    {
      question: "（テーマ）について、普段どのように関わっていますか？",
      followUpGuide: "頻度、場面、誰と一緒かなど、普段の様子を具体的に聞く",
    },
    {
      question: "最近「ちょっと困ったな」「面倒だな」と感じたのは、どんな場面でしたか？",
      followUpGuide:
        "いつ・どこで・何をしようとしていたときかを聞き、具体的な1場面を思い出してもらう",
    },
    {
      question: "そのとき、どうやって乗り切りましたか？",
      followUpGuide:
        "今使っている道具・サービス・工夫と、その不満な点を聞く",
    },
    {
      question: "それが解決したら、どんなふうに変わりそうですか？",
      followUpGuide:
        "理想の状態を具体的に描いてもらう。機能のアイデアより、何ができるようになりたいかを聞く",
    },
    {
      question: "この困りごとを解決するために、お金や時間をかけたことはありますか？",
      followUpGuide: "どのくらいかけたか、かけなかった理由を聞く",
    },
    {
      question: "最後に、ほかに伝えておきたいことがあれば教えてください。",
    },
  ],
  promptOverrides: {
    loop: {
      cautions: `## 注意事項
${COMMON_CAUTION_LINES}
- 「あったらいいと思いますか？」のような、答えが「はい」に寄る聞き方は避けてください。代わりに、実際にあった出来事や行動を聞いてください
- 回答者の言葉をそのまま使って聞き返し、言い換えて意味を変えないでください`,
      stopCriteria: `## 深掘りの打ち切り基準
具体的な出来事・行動・感情が聞けるまでは深掘りしてかまいません。ただし同じ方向に3回以上続けて掘り下げないでください。

- 具体的なエピソードを1〜2つ引き出せたら、その方向の深掘りは十分
- 「場合による」「特にない」など、これ以上掘っても新しい情報が出ないサインが出たら、視点を変えるか次の質問に進む
- 回答者が話題を変えたいサインを出したら、すぐに従う`,
    },
  },
};

const BLANK: InterviewTemplate = {
  key: "blank",
  label: "白紙から作る",
  headline: "質問もまとめ方もすべて自分で決める",
  asks: "設定した質問を順番に聞き、答えに応じて深掘りします",
  summaryItems: ["要約", "主な意見"],
  mode: "loop",
  estimatedMinutes: 5,
  defaultDescription: "",
  questions: [],
  promptOverrides: {},
};

export const INTERVIEW_TEMPLATES: Record<
  InterviewTemplateKey,
  InterviewTemplate
> = {
  post_use_survey: POST_USE_SURVEY,
  street_interview: STREET_INTERVIEW,
  needs_research: NEEDS_RESEARCH,
  blank: BLANK,
};

/** テンプレート選択画面に並べる順。白紙は別枠で出す。 */
export const SELECTABLE_TEMPLATE_KEYS = [
  "post_use_survey",
  "street_interview",
  "needs_research",
] as const satisfies readonly InterviewTemplateKey[];

export function getInterviewTemplate(key: string): InterviewTemplate {
  return INTERVIEW_TEMPLATES[key as InterviewTemplateKey] ?? BLANK;
}
