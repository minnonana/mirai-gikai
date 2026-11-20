import type { Route } from "next";
import Link from "next/link";
import { formatEstimatedDuration } from "@/features/interview-config/shared/utils/format-estimated-duration";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { TEMPLATE_BADGE_CLASSNAMES } from "../../shared/utils/template-badge";
import type { ListedInterview } from "../../shared/utils/to-listed-interview";

export function ListedInterviewList({
  interviews,
}: {
  interviews: ListedInterview[];
}) {
  if (interviews.length === 0) {
    return (
      <p className="rounded-2xl border border-mirai-border-light bg-white p-6 text-center text-sm text-mirai-text-note">
        いま回答を受け付けているインタビューはありません。
        <br />
        配布されたURLやQRコードからは回答できます。
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {interviews.map((interview) => {
        const duration = formatEstimatedDuration(interview.estimatedDuration);
        return (
          <li key={interview.billId}>
            <Link
              href={routes.interviewLP(interview.billId) as Route}
              className="flex flex-col gap-2 rounded-2xl border border-mirai-border-light bg-white p-4 transition-colors hover:border-primary"
            >
              <div className="flex items-center gap-2">
                {interview.templateKey !== "blank" && (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                      TEMPLATE_BADGE_CLASSNAMES[interview.templateKey]
                    )}
                  >
                    {interview.templateLabel}
                  </span>
                )}
                {duration && (
                  <span className="text-xs text-mirai-text-note">
                    {duration}
                  </span>
                )}
              </div>
              <span className="text-base font-bold leading-normal">
                {interview.title}
              </span>
              {interview.targetAudience && (
                <span className="text-[13px] text-mirai-text-note">
                  {interview.targetAudience}
                </span>
              )}
              <span className="self-end text-[13px] font-bold text-primary">
                回答する →
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
