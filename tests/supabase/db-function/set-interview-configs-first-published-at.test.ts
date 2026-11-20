import { afterEach, describe, expect, it } from "vitest";
import type { Database } from "../../../packages/supabase/types/supabase.types";
import { adminClient, cleanupTestBill, createTestBill } from "../utils";

type ConfigUpdate = Database["public"]["Tables"]["interview_configs"]["Update"];

async function createConfig(billId: string, status: "public" | "closed") {
  const { data, error } = await adminClient
    .from("interview_configs")
    .insert({ bill_id: billId, name: "テスト設定", status })
    .select("id, first_published_at")
    .single();
  if (error) throw new Error(`interview_config 作成失敗: ${error.message}`);
  return data;
}

async function updateConfig(configId: string, patch: ConfigUpdate) {
  const { data, error } = await adminClient
    .from("interview_configs")
    .update(patch)
    .eq("id", configId)
    .select("first_published_at")
    .single();
  if (error) throw new Error(`interview_config 更新失敗: ${error.message}`);
  return data.first_published_at;
}

describe("set_interview_configs_first_published_at トリガー", () => {
  const billIds: string[] = [];

  async function createBillId() {
    const bill = await createTestBill();
    billIds.push(bill.id);
    return bill.id;
  }

  afterEach(async () => {
    for (const id of billIds.splice(0)) await cleanupTestBill(id);
  });

  it("下書きで作ると null のまま", async () => {
    const config = await createConfig(await createBillId(), "closed");
    expect(config.first_published_at).toBeNull();
  });

  it("受付中にすると入り、終了（closed）にしても消えない", async () => {
    const config = await createConfig(await createBillId(), "closed");

    const opened = await updateConfig(config.id, { status: "public" });
    expect(opened).not.toBeNull();
    expect(await updateConfig(config.id, { status: "closed" })).toBe(opened);
  });

  it("もう一度受付中にしても、最初の日時のまま", async () => {
    const config = await createConfig(await createBillId(), "public");
    expect(config.first_published_at).not.toBeNull();

    await updateConfig(config.id, { status: "closed" });
    expect(await updateConfig(config.id, { status: "public" })).toBe(
      config.first_published_at
    );
  });

  it("直接書き換えようとしても変わらない", async () => {
    const config = await createConfig(await createBillId(), "public");
    expect(await updateConfig(config.id, { first_published_at: null })).toBe(
      config.first_published_at
    );
  });

  it("一度も受付していない設定には直接書き込めない", async () => {
    const config = await createConfig(await createBillId(), "closed");
    expect(
      await updateConfig(config.id, {
        first_published_at: "2026-01-01T00:00:00Z",
      })
    ).toBeNull();
  });
});
