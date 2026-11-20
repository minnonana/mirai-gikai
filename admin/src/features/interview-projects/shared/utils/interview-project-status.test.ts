import { describe, expect, it } from "vitest";
import { getInterviewProjectStatus } from "./interview-project-status";

describe("getInterviewProjectStatus", () => {
  it("公開中なら受付中", () => {
    expect(
      getInterviewProjectStatus({
        status: "public",
        first_published_at: "2026-11-01",
      })
    ).toBe("open");
  });

  it("一度も受付していなければ下書き", () => {
    expect(
      getInterviewProjectStatus({ status: "closed", first_published_at: null })
    ).toBe("draft");
  });

  it("受付したことがあって今は閉じていれば終了", () => {
    expect(
      getInterviewProjectStatus({
        status: "closed",
        first_published_at: "2026-11-01",
      })
    ).toBe("ended");
  });
});
