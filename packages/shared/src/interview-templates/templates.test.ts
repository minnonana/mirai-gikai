import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  EDITABLE_PROMPT_SECTION_KEYS,
  PROMPT_SECTION_MAX_LENGTH,
} from "../interview-prompts/sections";
import {
  getInterviewTemplate,
  INTERVIEW_TEMPLATE_KEYS,
  INTERVIEW_TEMPLATES,
  SELECTABLE_TEMPLATE_KEYS,
} from "./templates";

describe("INTERVIEW_TEMPLATES", () => {
  it("すべてのキーにテンプレートがあり、key が一致する", () => {
    for (const key of INTERVIEW_TEMPLATE_KEYS) {
      expect(INTERVIEW_TEMPLATES[key].key).toBe(key);
    }
  });

  it("DB の interview_template_enum と同じキーを持つ", () => {
    const migration = readFileSync(
      new URL(
        "../../../../supabase/migrations/20261120100000_add_interview_project_settings.sql",
        import.meta.url
      ),
      "utf8"
    );
    const enumBody = migration.match(
      /create type interview_template_enum as enum \(([^)]*)\)/
    )?.[1];
    const dbKeys = [...(enumBody ?? "").matchAll(/'([a-z_]+)'/g)].map(
      (m) => m[1]
    );
    expect([...dbKeys].sort()).toEqual([...INTERVIEW_TEMPLATE_KEYS].sort());
  });

  it("選択画面に出すテンプレートには質問が1つ以上ある", () => {
    for (const key of SELECTABLE_TEMPLATE_KEYS) {
      expect(INTERVIEW_TEMPLATES[key].questions.length).toBeGreaterThan(0);
    }
  });

  it("AIの聞き方の上書きは、管理画面で編集できる節だけで、上限文字数以内", () => {
    for (const key of INTERVIEW_TEMPLATE_KEYS) {
      const overrides = INTERVIEW_TEMPLATES[key].promptOverrides;
      for (const sections of Object.values(overrides)) {
        for (const [sectionKey, text] of Object.entries(sections ?? {})) {
          expect(EDITABLE_PROMPT_SECTION_KEYS).toContain(sectionKey);
          expect((text ?? "").length).toBeLessThanOrEqual(
            PROMPT_SECTION_MAX_LENGTH
          );
        }
      }
    }
  });

  it("テンプレートの文面に法案向けの言葉が残っていない", () => {
    const text = JSON.stringify(INTERVIEW_TEMPLATES);
    expect(text).not.toMatch(/法案|議案|国会/);
  });
});

describe("getInterviewTemplate", () => {
  it("知っているキーならそのテンプレートを返す", () => {
    expect(getInterviewTemplate("street_interview").label).toBe(
      "街頭インタビュー"
    );
  });

  it("知らないキーなら白紙テンプレートを返す", () => {
    expect(getInterviewTemplate("unknown").key).toBe("blank");
  });
});
