import "server-only";

import { createAdminClient, type Database } from "@mirai-gikai/supabase";
import { deleteBillById } from "@/features/bills/server/repositories/bill-repository";
import { createBillRecord } from "@/features/bills-edit/server/repositories/bill-edit-repository";
import {
  createInterviewConfigRecord,
  createInterviewQuestions,
} from "@/features/interview-config/server/repositories/interview-config-repository";
import type { buildProjectRecords } from "../../shared/utils/build-project-records";

type ProjectRecords = ReturnType<typeof buildProjectRecords>;

/**
 * 案件（議案・本文・インタビュー設定・質問）をまとめて作る。
 * 途中で失敗したら議案ごと消す（本文・設定・質問は議案の削除に連動して消える）。
 */
export async function createInterviewProjectRecords(
  records: ProjectRecords
): Promise<{ billId: string; configId: string }> {
  const bill = await createBillRecord(records.bill);

  try {
    const [config] = await Promise.all([
      createConfigWithQuestions(bill.id, records),
      insertBillContents(bill.id, records.billContents),
    ]);
    return { billId: bill.id, configId: config.id };
  } catch (error) {
    await deleteBillById(bill.id).catch((deleteError) => {
      console.error("Failed to roll back bill:", bill.id, deleteError);
    });
    throw error;
  }
}

async function createConfigWithQuestions(
  billId: string,
  records: ProjectRecords
): Promise<{ id: string }> {
  const config = await createInterviewConfigRecord({
    ...records.config,
    bill_id: billId,
    themes: null,
    chat_model: null,
  });
  if (records.questions.length > 0) {
    await createInterviewQuestions(
      records.questions.map((q) => ({ ...q, interview_config_id: config.id }))
    );
  }
  return config;
}

async function insertBillContents(
  billId: string,
  contents: ProjectRecords["billContents"]
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("bill_contents")
    .insert(contents.map((c) => ({ ...c, bill_id: billId })));
  if (error) {
    throw new Error(`Failed to create bill contents: ${error.message}`);
  }
}

/**
 * 設定ごとの完了した回答数。
 * 行を取得して数えると PostgREST の件数上限で頭打ちになるため、設定ごとに件数だけを数える。
 */
export async function countCompletedSessionsByConfigIds(
  configIds: string[]
): Promise<Record<string, number>> {
  const supabase = createAdminClient();
  const counts = await Promise.all(
    configIds.map(async (configId) => {
      const { count, error } = await supabase
        .from("interview_sessions")
        .select("id", { count: "exact", head: true })
        .eq("interview_config_id", configId)
        .not("completed_at", "is", null);
      if (error) {
        throw new Error(`Failed to count sessions: ${error.message}`);
      }
      return [configId, count ?? 0] as const;
    })
  );
  return Object.fromEntries(counts);
}

/**
 * 案件の基本情報（タイトル・説明）と、インタビュー設定側の案件設定をまとめて更新する。
 * 本文はタイトルと説明だけを書き換え、本文（content）には触れない。
 */
export async function updateProjectRecords(params: {
  billId: string;
  configId: string;
  title: string;
  description: string;
  configSettings: Pick<
    Database["public"]["Tables"]["interview_configs"]["Update"],
    "report_visibility" | "is_listed" | "target_audience"
  >;
}): Promise<void> {
  const supabase = createAdminClient();
  const results = await Promise.all([
    supabase
      .from("bills")
      .update({ name: params.title })
      .eq("id", params.billId),
    supabase
      .from("bill_contents")
      .update({ title: params.title, summary: params.description })
      .eq("bill_id", params.billId),
    supabase
      .from("interview_configs")
      .update(params.configSettings)
      .eq("id", params.configId)
      .eq("bill_id", params.billId),
  ]);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    throw new Error(
      `Failed to update interview project: ${failed.error.message}`
    );
  }
}

/** 編集画面に出す案件の基本情報（説明は やさしい版 を正とする） */
export async function findProjectBasics(
  billId: string
): Promise<{ title: string; description: string } | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bill_contents")
    .select("title, summary")
    .eq("bill_id", billId)
    .eq("difficulty_level", "normal")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch bill contents: ${error.message}`);
  }
  return data ? { title: data.title, description: data.summary } : null;
}
