"use server";

import { getInterviewTemplate } from "@mirai-gikai/shared/interview-templates/templates";
import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import {
  type CreateInterviewProjectInput,
  createInterviewProjectSchema,
} from "../../shared/schemas";
import { buildProjectRecords } from "../../shared/utils/build-project-records";
import { createInterviewProjectRecords } from "../repositories/interview-project-repository";

export type CreateInterviewProjectResult =
  | { success: true; data: { billId: string; configId: string } }
  | { success: false; error: string };

/**
 * テンプレートを選んで新しいインタビュー案件を作る。下書きの状態で作られる。
 */
export async function createInterviewProject(
  input: CreateInterviewProjectInput
): Promise<CreateInterviewProjectResult> {
  try {
    await requireAdmin();
    const { template, title } = createInterviewProjectSchema.parse(input);

    const records = buildProjectRecords(getInterviewTemplate(template), title);
    const ids = await createInterviewProjectRecords(records);

    await invalidateWebCache([
      WEB_CACHE_TAGS.BILLS,
      WEB_CACHE_TAGS.INTERVIEW_CONFIGS,
    ]);

    return { success: true, data: ids };
  } catch (error) {
    console.error("Create interview project error:", error);
    return {
      success: false,
      error: getErrorMessage(
        error,
        "インタビューの作成中にエラーが発生しました"
      ),
    };
  }
}
