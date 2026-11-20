import type { InterviewTemplateKey } from "@mirai-gikai/shared/interview-templates/templates";

/** 用途ごとのバッジの色（globals.css の template トークン） */
export const TEMPLATE_BADGE_CLASSNAMES: Record<InterviewTemplateKey, string> = {
  post_use_survey: "bg-template-post-use-bg text-template-post-use-fg",
  street_interview: "bg-template-street-bg text-template-street-fg",
  needs_research: "bg-template-needs-bg text-template-needs-fg",
  blank: "bg-template-blank-bg text-template-blank-fg",
};
