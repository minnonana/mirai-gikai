import { describe, expect, it } from "vitest";
import { buildRespondentUrl } from "./respondent-url";

describe("buildRespondentUrl", () => {
  it("公開サイトのURLに /i/{案件ID} をつなげる", () => {
    expect(buildRespondentUrl("https://example.com", "abc")).toBe(
      "https://example.com/i/abc"
    );
  });

  it("公開サイトのURLの末尾にスラッシュがあっても二重にしない", () => {
    expect(buildRespondentUrl("http://localhost:3000/", "abc")).toBe(
      "http://localhost:3000/i/abc"
    );
  });
});
