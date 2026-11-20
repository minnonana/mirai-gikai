import type { InterviewTemplateKey } from "@mirai-gikai/shared/interview-templates/templates";

/** 用途ごとのバッジの色。一覧と編集画面で同じ色にする。 */
export const TEMPLATE_BADGE_CLASSNAMES: Record<InterviewTemplateKey, string> = {
  post_use_survey: "border-transparent bg-blue-50 text-blue-800",
  street_interview: "border-transparent bg-orange-50 text-orange-800",
  needs_research: "border-transparent bg-green-50 text-green-800",
  blank: "border-transparent bg-gray-100 text-gray-700",
};
