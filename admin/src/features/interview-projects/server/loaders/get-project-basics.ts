import "server-only";

import { findProjectBasics } from "../repositories/interview-project-repository";

/** 編集画面に出す案件のタイトルと説明 */
export async function getProjectBasics(billId: string) {
  return findProjectBasics(billId);
}
