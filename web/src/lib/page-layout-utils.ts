/**
 * ページレイアウトに関するユーティリティ
 *
 * 法案一覧・法案詳細を「メインページ」として扱い、
 * - DifficultySelectorを表示
 * - チャットサイドバー用のオフセットレイアウトを使用
 *
 * トップページはインタビューの一覧になったため、メインページには含めない。
 */

/** メインページ（法案一覧、法案詳細）かどうかを判定 */
export function isMainPage(pathname: string): boolean {
  // 法案一覧ページ
  if (pathname === "/bills") return true;
  // 法案詳細ページ（/bills/[id]）- サブパスは除外
  if (/^\/bills\/[^/]+$/.test(pathname)) return true;
  return false;
}

/** インタビューチャットページかどうかを判定（/i/[id]/chat、プレビュー含む） */
export function isInterviewPage(pathname: string): boolean {
  return /\/i\/[^/]+\/chat$/.test(pathname);
}

/** インタビューセクション（案内・チャット含む）かどうかを判定（/i/[id] 以下すべて） */
export function isInterviewSection(pathname: string): boolean {
  return /(^|\/preview)\/i\/[^/]+(\/|$)/.test(pathname);
}

/** インタビューページから案件ID（billId）を抽出 */
export function extractBillIdFromPath(pathname: string): string | null {
  const match = pathname.match(/(?:^|\/preview)\/(?:i|bills)\/([^/]+)/);
  return match ? match[1] : null;
}
