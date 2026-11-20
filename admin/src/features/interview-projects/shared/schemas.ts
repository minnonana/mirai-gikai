import { INTERVIEW_TEMPLATE_KEYS } from "@mirai-gikai/shared/interview-templates/templates";
import type { Database } from "@mirai-gikai/supabase";
import { z } from "zod";

/**
 * インタビュー案件。
 *
 * 中身は「議案(bills) + 議案本文(bill_contents) + インタビュー設定(interview_configs)」の組。
 * 法案以外の用途でも同じ AI インタビューの仕組みを使うため、議案を案件の入れ物として流用している。
 */

export type ReportVisibility =
  Database["public"]["Enums"]["interview_report_visibility_enum"];

export const REPORT_VISIBILITIES = [
  "private",
  "consented",
] as const satisfies readonly ReportVisibility[];

export const REPORT_VISIBILITY_LABELS: Record<ReportVisibility, string> = {
  private: "公開しない",
  consented: "同意した人だけ公開",
};

export const createInterviewProjectSchema = z.object({
  template: z.enum(INTERVIEW_TEMPLATE_KEYS),
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(120, "タイトルは120文字以内にしてください"),
});

export type CreateInterviewProjectInput = z.infer<
  typeof createInterviewProjectSchema
>;

export const interviewProjectSettingsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(120, "タイトルは120文字以内にしてください"),
  description: z.string().trim().max(1000, "説明は1000文字以内にしてください"),
  targetAudience: z
    .string()
    .trim()
    .max(100, "対象者は100文字以内にしてください"),
  reportVisibility: z.enum(REPORT_VISIBILITIES),
  isListed: z.boolean(),
});

export type InterviewProjectSettingsInput = z.infer<
  typeof interviewProjectSettingsSchema
>;
