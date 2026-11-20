/**
 * 外部リンク定数
 */

/**
 * この fork 版（TENJO議会）自身のソースコードを公開しているリポジトリ。
 * AGPL-3.0 第13条により、実際に稼働しているバージョンのソースコードが
 * 置かれた公開リポジトリを指す必要がある。
 */
const GITHUB_REPO = "https://github.com/minnonana/mirai-gikai";

export const EXTERNAL_LINKS = {
  /** 不具合・誤りの報告先（fork 版リポジトリの Issues） */
  REPORT: `${GITHUB_REPO}/issues`,
  FORK_GUIDELINES_NOTE: "https://note.com/team_mirai_jp/n/nc59ec347e8c7",
  GITHUB_REPO,
  /** fork 元（本家）のサービスとリポジトリ */
  UPSTREAM_SITE: "https://gikai.team-mir.ai/",
  UPSTREAM_REPO: "https://github.com/team-mirai/mirai-gikai",
} as const;

/**
 * お問い合わせ先メールアドレス。
 * TODO: 公開前に、TENJO KANAZAWA の実際の連絡先に差し替えること。
 */
export const CONTACT_EMAIL = "contact@example.com";
