import { describe, expect, it } from "vitest";
import {
  type ListedInterviewRow,
  toListedInterview,
} from "./to-listed-interview";

const baseRow: ListedInterviewRow = {
  bill_id: "bill-1",
  template: "post_use_survey",
  estimated_duration: 5,
  target_audience: "ツアーに参加した方",
  bills: {
    name: "内部用の名前",
    bill_contents: [
      { title: "詳しい版のタイトル", difficulty_level: "hard" },
      { title: "やさしい版のタイトル", difficulty_level: "normal" },
    ],
  },
};

describe("toListedInterview", () => {
  it("やさしい版のタイトルを優先して使う", () => {
    expect(toListedInterview(baseRow).title).toBe("やさしい版のタイトル");
  });

  it("本文が無ければ案件の名前を使う", () => {
    const row = { ...baseRow, bills: { name: "名前", bill_contents: [] } };
    expect(toListedInterview(row).title).toBe("名前");
  });

  it("テンプレートの名前と所要時間・対象者を引き継ぐ", () => {
    expect(toListedInterview(baseRow)).toMatchObject({
      billId: "bill-1",
      templateKey: "post_use_survey",
      templateLabel: "使用後の調査",
      estimatedDuration: 5,
      targetAudience: "ツアーに参加した方",
    });
  });

  it("知らないテンプレートは白紙として扱う", () => {
    expect(
      toListedInterview({ ...baseRow, template: "unknown" }).templateKey
    ).toBe("blank");
  });
});
