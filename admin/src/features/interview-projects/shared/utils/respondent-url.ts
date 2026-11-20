/**
 * 回答者がインタビューに答えるページのURL。
 * 公開サイト側のルート（web の routes.interviewLP）と同じ形にしている。
 */
export function buildRespondentUrl(webUrl: string, billId: string): string {
  return new URL(`/i/${billId}`, webUrl).toString();
}
