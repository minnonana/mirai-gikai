-- 法案以外の用途（使用後の調査・街頭インタビュー・ニーズ調査など）でも
-- AIインタビューを作れるようにするための設定項目。
-- インタビュー案件の本体（タイトル・説明）はこれまでどおり bills / bill_contents に持つ。

-- 1. 用途別テンプレート
create type interview_template_enum as enum (
  'blank',
  'post_use_survey',
  'street_interview',
  'needs_research'
);

alter table interview_configs
  add column template interview_template_enum not null default 'blank';

comment on column interview_configs.template is
  '作成時に選んだ用途別テンプレート。質問の初期値・AIの聞き方・回答のまとめ方の初期値を決める';

-- 2. 回答の公開設定
create type interview_report_visibility_enum as enum (
  'private',
  'consented'
);

alter table interview_configs
  add column report_visibility interview_report_visibility_enum not null default 'private';

comment on column interview_configs.report_visibility is
  'private=回答は運営者だけが読む / consented=回答者が同意した回答だけ公開ページに載せる';

-- 3. トップページの一覧に表示するか
alter table interview_configs
  add column is_listed boolean not null default false;

comment on column interview_configs.is_listed is
  'true のときだけ公開サイトのトップに表示する。false でも配布した URL からは回答できる';

-- 4. 対象者（回答者向けの案内に表示する）
alter table interview_configs
  add column target_audience text;

comment on column interview_configs.target_audience is
  '回答者向けの案内に表示する対象者の説明（例: ツアーに参加した方）';

-- 5. 初めて受付中にした日時
-- published_at は closed にすると null に戻る（受付中の期間を表す）ため、
-- 「下書き（一度も受付していない）」と「終了（受付したことがある）」を見分けられない。
-- 一度入れたら消さない列を別に持つ。既存の受付中の設定は published_at で埋める。
alter table interview_configs add column first_published_at timestamptz;

comment on column interview_configs.first_published_at is
  'インタビューを初めて受付中（status=public）にした日時。一度入れたら更新しない。null は一度も受付していない';

update interview_configs
  set first_published_at = published_at
  where published_at is not null;

create function set_interview_configs_first_published_at() returns trigger as $$
begin
  if tg_op = 'UPDATE' and old.first_published_at is not null then
    new.first_published_at := old.first_published_at;
  elsif new.status = 'public' then
    new.first_published_at := coalesce(new.first_published_at, now());
  else
    new.first_published_at := null;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger set_interview_configs_first_published_at
  before insert or update on interview_configs
  for each row
  execute function set_interview_configs_first_published_at();
