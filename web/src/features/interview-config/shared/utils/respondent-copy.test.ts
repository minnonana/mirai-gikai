import { describe, expect, it } from "vitest";
import { getAnswerHandlingNote, getConsentNotes } from "./respondent-copy";

describe("getAnswerHandlingNote", () => {
  it("非公開のインタビューでは、公開されないと伝える", () => {
    expect(getAnswerHandlingNote("private").title).toBe("回答は公開されません");
  });

  it("同意した人だけ公開するインタビューでは、本人が選べると伝える", () => {
    expect(getAnswerHandlingNote("consented").title).toContain(
      "あなたが選べます"
    );
  });
});

describe("getConsentNotes", () => {
  it("非公開なら、公開されないことを同意事項に含める", () => {
    const notes = getConsentNotes("private");
    expect(notes).toContain("回答がサイトで公開されることはありません。");
    expect(notes.join("")).not.toContain("掲載されます");
  });

  it("同意した人だけ公開なら、公開を選べることを同意事項に含める", () => {
    const notes = getConsentNotes("consented");
    expect(notes.join("")).toContain("公開してよいかを選べます");
  });

  it("どちらの設定でも政党や国会に関する文言を含めない", () => {
    for (const visibility of ["private", "consented"] as const) {
      expect(getConsentNotes(visibility).join("")).not.toMatch(/政策|国会|党/);
    }
  });
});
