import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";

/**
 * bill_idから公開ステータスのインタビュー設定を取得
 */
export async function findPublicInterviewConfigByBillId(billId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_configs")
    .select("*")
    .eq("bill_id", billId)
    .eq("status", "public")
    .is("deleted_at", null)
    .single();

  return { data, error };
}

/**
 * bill_idから最新のインタビュー設定を取得（ステータス問わず）
 */
export async function findLatestInterviewConfigByBillId(billId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_configs")
    .select("*")
    .eq("bill_id", billId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  return { data, error };
}

/**
 * interview_config_idからインタビュー質問一覧を取得（question_order昇順）
 */
export async function findInterviewQuestionsByConfigId(
  interviewConfigId: string
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("interview_config_id", interviewConfigId)
    .order("question_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch interview questions: ${error.message}`);
  }

  return data;
}

/**
 * トップに並べるインタビュー（受付中かつ一覧表示ON）を新しい順に取得
 */
export async function findListedPublicInterviews() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_configs")
    .select(
      "id, bill_id, template, estimated_duration, target_audience, published_at, bills!inner(name, publish_status, bill_contents(title, difficulty_level))"
    )
    .eq("status", "public")
    .eq("is_listed", true)
    .is("deleted_at", null)
    .eq("bills.publish_status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Failed to fetch listed interviews: ${error.message}`);
  }

  return data;
}
