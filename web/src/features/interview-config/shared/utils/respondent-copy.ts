import type { Database } from "@mirai-gikai/supabase";

export type ReportVisibility =
  Database["public"]["Enums"]["interview_report_visibility_enum"];

/**
 * 回答者に見せる「回答の扱い」の説明。
 * インタビューごとの公開設定で文面を変える。
 */
export function getAnswerHandlingNote(visibility: ReportVisibility): {
  title: string;
  body: string;
} {
  if (visibility === "consented") {
    return {
      title: "公開するかは、最後にあなたが選べます",
      body: "公開を選んだ場合だけ、名前や連絡先を除いた回答がサイトに載ります",
    };
  }
  return {
    title: "回答は公開されません",
    body: "このインタビューの運営者だけが読みます",
  };
}

/** インタビュー開始前の同意事項 */
export function getConsentNotes(visibility: ReportVisibility): string[] {
  const notes = [
    "回答は、このインタビューの運営者が内容の検討に利用します。",
    "個人情報や機密情報の記載はお控えください。",
  ];
  if (visibility === "consented") {
    notes.push(
      "回答後に、公開してよいかを選べます。公開を選んだ場合、回答の要約と会話の全文がサイトに掲載されます。"
    );
  } else {
    notes.push("回答がサイトで公開されることはありません。");
  }
  return notes;
}
