import type { InterviewTemplateKey } from "@mirai-gikai/shared/interview-templates/templates";
import { getInterviewTemplate } from "@mirai-gikai/shared/interview-templates/templates";

export type ListedInterviewRow = {
  bill_id: string;
  template: string;
  estimated_duration: number | null;
  target_audience: string | null;
  bills: {
    name: string;
    bill_contents: { title: string; difficulty_level: string }[];
  };
};

export type ListedInterview = {
  billId: string;
  title: string;
  templateKey: InterviewTemplateKey;
  templateLabel: string;
  estimatedDuration: number | null;
  targetAudience: string | null;
};

/** トップに並べるカード1枚ぶんの表示内容に変換する（タイトルは やさしい版 を優先） */
export function toListedInterview(row: ListedInterviewRow): ListedInterview {
  const template = getInterviewTemplate(row.template);
  const contents = row.bills.bill_contents ?? [];
  const title =
    contents.find((c) => c.difficulty_level === "normal")?.title ??
    contents[0]?.title ??
    row.bills.name;
  return {
    billId: row.bill_id,
    title,
    templateKey: template.key,
    templateLabel: template.label,
    estimatedDuration: row.estimated_duration,
    targetAudience: row.target_audience,
  };
}
