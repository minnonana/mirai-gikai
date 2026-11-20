export type InterviewProjectStatus = "draft" | "open" | "ended";

/**
 * 受付の状態。DB の status は public / closed の2つだけなので、
 * 一度も受付していない closed を「下書き」、受付したことがある closed を「終了」と見なす。
 * published_at は closed にすると消えるため、消えない first_published_at で判定する。
 */
export function getInterviewProjectStatus(config: {
  status: string;
  first_published_at: string | null;
}): InterviewProjectStatus {
  if (config.status === "public") return "open";
  return config.first_published_at ? "ended" : "draft";
}

export const INTERVIEW_PROJECT_STATUS_LABELS: Record<
  InterviewProjectStatus,
  string
> = {
  draft: "下書き",
  open: "受付中",
  ended: "終了",
};
