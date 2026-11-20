import { INTERVIEW_TEMPLATES } from "@mirai-gikai/shared/interview-templates/templates";
import { describe, expect, it } from "vitest";
import { buildProjectRecords } from "./build-project-records";

describe("buildProjectRecords", () => {
  const template = INTERVIEW_TEMPLATES.post_use_survey;
  const records = buildProjectRecords(
    template,
    "夜の街歩きツアー 参加後アンケート"
  );

  it("案件の名前とタイトルにタイトルを入れる", () => {
    expect(records.bill.name).toBe("夜の街歩きツアー 参加後アンケート");
    expect(records.config.name).toBe("夜の街歩きツアー 参加後アンケート");
    for (const content of records.billContents) {
      expect(content.title).toBe("夜の街歩きツアー 参加後アンケート");
    }
  });

  it("説明は、やさしい版・詳しい版の両方にテンプレートの雛形を入れる", () => {
    expect(records.billContents.map((c) => c.difficulty_level)).toEqual([
      "normal",
      "hard",
    ]);
    for (const content of records.billContents) {
      expect(content.summary).toBe(template.defaultDescription);
    }
  });

  it("インタビュー設定は下書きで、テンプレートの値を引き継ぐ", () => {
    expect(records.config).toMatchObject({
      template: "post_use_survey",
      status: "closed",
      mode: template.mode,
      estimated_duration: template.estimatedMinutes,
      prompt_overrides: template.promptOverrides,
    });
  });

  it("質問は1から順番を振り、無い項目は null にする", () => {
    expect(records.questions[0]).toMatchObject({
      question: template.questions[0].question,
      question_order: 1,
      follow_up_guide: null,
    });
    expect(records.questions.at(-1)?.question_order).toBe(
      template.questions.length
    );
  });

  it("白紙テンプレートは質問なし・AIの聞き方の上書きなし", () => {
    const blank = buildProjectRecords(INTERVIEW_TEMPLATES.blank, "白紙");
    expect(blank.questions).toEqual([]);
    expect(blank.config.prompt_overrides).toBeNull();
  });
});
