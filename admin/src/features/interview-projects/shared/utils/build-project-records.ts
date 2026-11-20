import type { InterviewTemplate } from "@mirai-gikai/shared/interview-templates/templates";

/**
 * 法案向けの列のうち、必須のものに入れる固定値。
 * インタビュー案件では使わない列なので、固定値を入れておく。
 * 注意: 公開サイトの旧・法案ページ（/bills など）は publish_status だけで絞り込むため、
 * 案件もそこに法案として出る。法案ページは議会向け機能の削除と一緒に外す。
 */
const PLACEHOLDER_BILL_FIELDS = {
  originating_house: "HR",
  status: "introduced",
} as const;

/** 回答者向けの説明は、やさしい版・詳しい版の両方に同じ文面を入れる */
const PROJECT_DIFFICULTY_LEVELS = ["normal", "hard"] as const;

/**
 * テンプレートとタイトルから、案件を作るのに必要な行を組み立てる。
 *
 * インタビュー設定は「下書き（closed）」で作る。公開は編集画面で受付中にしたとき。
 */
export function buildProjectRecords(
  template: InterviewTemplate,
  title: string
) {
  return {
    bill: {
      name: title,
      publish_status: "published" as const,
      ...PLACEHOLDER_BILL_FIELDS,
    },
    billContents: PROJECT_DIFFICULTY_LEVELS.map((difficulty_level) => ({
      difficulty_level,
      title,
      summary: template.defaultDescription,
      content: "",
    })),
    config: {
      name: title,
      template: template.key,
      status: "closed" as const,
      mode: template.mode,
      estimated_duration: template.estimatedMinutes,
      prompt_overrides:
        Object.keys(template.promptOverrides).length > 0
          ? template.promptOverrides
          : null,
    },
    questions: template.questions.map((q, index) => ({
      question: q.question,
      follow_up_guide: q.followUpGuide ?? null,
      quick_replies: q.quickReplies ?? null,
      question_order: index + 1,
    })),
  };
}
