"use server";

import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import {
  type InterviewProjectSettingsInput,
  interviewProjectSettingsSchema,
} from "../../shared/schemas";
import { updateProjectRecords } from "../repositories/interview-project-repository";

export type UpdateInterviewProjectSettingsResult =
  | { success: true }
  | { success: false; error: string };

/**
 * 案件の基本情報（タイトル・説明・対象者）と公開設定を保存する。
 */
export async function updateInterviewProjectSettings(
  billId: string,
  configId: string,
  input: InterviewProjectSettingsInput
): Promise<UpdateInterviewProjectSettingsResult> {
  try {
    await requireAdmin();
    const values = interviewProjectSettingsSchema.parse(input);

    await updateProjectRecords({
      billId,
      configId,
      title: values.title,
      description: values.description,
      configSettings: {
        report_visibility: values.reportVisibility,
        is_listed: values.isListed,
        target_audience: values.targetAudience || null,
      },
    });

    await invalidateWebCache([
      WEB_CACHE_TAGS.BILLS,
      WEB_CACHE_TAGS.INTERVIEW_CONFIGS,
    ]);

    return { success: true };
  } catch (error) {
    console.error("Update interview project settings error:", error);
    return {
      success: false,
      error: getErrorMessage(error, "保存中にエラーが発生しました"),
    };
  }
}
