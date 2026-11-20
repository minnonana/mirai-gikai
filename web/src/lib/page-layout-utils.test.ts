import { describe, expect, it } from "vitest";

import {
  extractBillIdFromPath,
  isInterviewPage,
  isInterviewSection,
  isMainPage,
} from "./page-layout-utils";

describe("isMainPage", () => {
  // トップはインタビューの一覧になり、法案向けのサイドバーは出さない
  it("returns false for the top page", () => {
    expect(isMainPage("/")).toBe(false);
  });

  it("returns true for a bill detail page", () => {
    expect(isMainPage("/bills/abc-123")).toBe(true);
  });

  it("returns false for an interview page", () => {
    expect(isMainPage("/i/abc-123")).toBe(false);
  });

  it("returns false for an unrelated path", () => {
    expect(isMainPage("/about")).toBe(false);
  });

  // 一覧でも難易度の切り替えとチャットのサイドバーを出す。
  it("returns true for the bills list page", () => {
    expect(isMainPage("/bills")).toBe(true);
  });

  // 末尾スラッシュは Next 側で正規化されるため、素の一致だけを見る。
  it("returns false for the bills list page with a trailing slash", () => {
    expect(isMainPage("/bills/")).toBe(false);
  });
});

describe("isInterviewPage", () => {
  it("returns true for an interview chat page", () => {
    expect(isInterviewPage("/i/abc-123/chat")).toBe(true);
  });

  it("returns true for a preview interview chat page", () => {
    expect(isInterviewPage("/preview/i/abc-123/chat")).toBe(true);
  });

  it("returns false for an interview page without /chat", () => {
    expect(isInterviewPage("/i/abc-123")).toBe(false);
  });

  it("returns false for a bill detail page", () => {
    expect(isInterviewPage("/bills/abc-123")).toBe(false);
  });

  it("returns false for the top page", () => {
    expect(isInterviewPage("/")).toBe(false);
  });
});

describe("isInterviewSection", () => {
  it("returns true for the interview LP page", () => {
    expect(isInterviewSection("/i/abc-123")).toBe(true);
  });

  it("returns true for the preview interview LP page", () => {
    expect(isInterviewSection("/preview/i/abc-123")).toBe(true);
  });

  it("returns true for the interview chat page", () => {
    expect(isInterviewSection("/i/abc-123/chat")).toBe(true);
  });

  it("returns false for a bill detail page", () => {
    expect(isInterviewSection("/bills/abc-123")).toBe(false);
  });

  it("returns false for the top page", () => {
    expect(isInterviewSection("/")).toBe(false);
  });

  it("returns false for unrelated paths", () => {
    expect(isInterviewSection("/about")).toBe(false);
  });
});

describe("extractBillIdFromPath", () => {
  it("extracts bill ID from a bill detail path", () => {
    expect(extractBillIdFromPath("/bills/abc-123")).toBe("abc-123");
  });

  it("extracts bill ID from a bill sub-path", () => {
    expect(extractBillIdFromPath("/bills/abc-123/topics")).toBe("abc-123");
  });

  it("extracts the project ID from an interview path", () => {
    expect(extractBillIdFromPath("/i/abc-123/chat")).toBe("abc-123");
    expect(extractBillIdFromPath("/preview/i/abc-123/chat")).toBe("abc-123");
  });

  it("returns null when path does not contain a project ID", () => {
    expect(extractBillIdFromPath("/about")).toBeNull();
  });

  it("returns null for the top page", () => {
    expect(extractBillIdFromPath("/")).toBeNull();
  });
});
