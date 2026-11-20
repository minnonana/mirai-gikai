import { getInterviewTemplate } from "@mirai-gikai/shared/interview-templates/templates";
import { Clock, Lock, MessageSquare, Users } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import type { BillWithContent } from "@/features/bills/shared/types";
import { formatEstimatedDuration } from "@/features/interview-config/shared/utils/format-estimated-duration";
import { getInterviewDisclosureLink } from "@/features/interview-config/shared/utils/interview-links";
import { getAnswerHandlingNote } from "@/features/interview-config/shared/utils/respondent-copy";
import { TEMPLATE_BADGE_CLASSNAMES } from "@/features/interview-config/shared/utils/template-badge";
import { PastReportsSection } from "@/features/interview-report/client/components/past-reports-section";
import type { UserReportsResult } from "@/features/interview-report/server/loaders/get-user-reports-by-interview-config";
import { InterviewStatusBadge } from "@/features/interview-session/client/components/interview-status-badge";
import type { LatestInterviewSession } from "@/features/interview-session/server/loaders/get-latest-interview-session";
import { cn } from "@/lib/utils";
import type { InterviewConfig } from "../../server/loaders/get-interview-config";
import { InterviewActionButtons } from "./interview-action-buttons";

interface InterviewLPPageProps {
  bill: BillWithContent;
  interviewConfig: InterviewConfig;
  sessionInfo: LatestInterviewSession | null;
  previewToken?: string;
  userReports?: UserReportsResult | null;
}

function InfoRow({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-primary">{icon}</span>
      <p className="text-sm leading-relaxed">
        <span className="font-bold">{title}</span>
        <br />
        <span className="text-mirai-text-note">{body}</span>
      </p>
    </div>
  );
}

export function InterviewLPPage({
  bill,
  interviewConfig,
  sessionInfo,
  previewToken,
  userReports,
}: InterviewLPPageProps) {
  const template = getInterviewTemplate(interviewConfig.template);
  const title = bill.bill_content?.title ?? bill.name;
  const description = bill.bill_content?.summary;
  const durationText = formatEstimatedDuration(
    interviewConfig.estimated_duration
  );
  const handling = getAnswerHandlingNote(interviewConfig.report_visibility);

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-6 px-5 pb-12 pt-24 md:pt-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {template.key !== "blank" && (
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                TEMPLATE_BADGE_CLASSNAMES[template.key]
              )}
            >
              {template.label}
            </span>
          )}
          {sessionInfo && <InterviewStatusBadge status={sessionInfo.status} />}
        </div>
        <h1 className="text-[23px] font-black leading-normal">{title}</h1>
        {description && (
          <p className="whitespace-pre-line text-sm leading-[1.8] text-mirai-text-note">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-mirai-border-light bg-white p-4">
        {durationText && (
          <InfoRow
            icon={<Clock className="size-5" aria-hidden />}
            title={`所要時間は${durationText}`}
            body="途中で保存して、あとから続きを答えられます"
          />
        )}
        {interviewConfig.target_audience && (
          <InfoRow
            icon={<Users className="size-5" aria-hidden />}
            title="対象の方"
            body={interviewConfig.target_audience}
          />
        )}
        <InfoRow
          icon={<MessageSquare className="size-5" aria-hidden />}
          title="選択肢を押すか、自由に入力"
          body="AIがお話を深くうかがうため、追加で質問することがあります"
        />
        <InfoRow
          icon={<Lock className="size-5" aria-hidden />}
          title={handling.title}
          body={handling.body}
        />
      </div>

      {userReports && userReports.reports.length > 0 && (
        <PastReportsSection reports={userReports.reports} />
      )}

      <div className="flex flex-col gap-3">
        <InterviewActionButtons
          billId={bill.id}
          sessionInfo={sessionInfo}
          previewToken={previewToken}
          reportVisibility={interviewConfig.report_visibility}
        />
        <p className="text-center text-xs leading-relaxed text-mirai-text-note">
          個人情報や機密情報は書かないでください。
          <br />
          <Link
            href={getInterviewDisclosureLink(bill.id, previewToken) as Route}
            className="underline underline-offset-2"
          >
            AIインタビューの仕組みについて
          </Link>
        </p>
      </div>
    </div>
  );
}
