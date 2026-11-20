import { getInterviewTemplate } from "@mirai-gikai/shared/interview-templates/templates";
import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getBillById } from "@/features/bills-edit/server/loaders/get-bill-by-id";
import { InterviewConfigEditClient } from "@/features/interview-config/client/components/interview-config-edit-client";
import { getInterviewConfigById } from "@/features/interview-config/server/loaders/get-interview-config";
import { getInterviewQuestions } from "@/features/interview-config/server/loaders/get-interview-questions";
import { ProjectSettingsForm } from "@/features/interview-projects/client/components/project-settings-form";
import { getProjectBasics } from "@/features/interview-projects/server/loaders/get-project-basics";
import { buildRespondentUrl } from "@/features/interview-projects/shared/utils/respondent-url";
import { TEMPLATE_BADGE_CLASSNAMES } from "@/features/interview-projects/shared/utils/template-badge";
import { getCompletedReportsForBill } from "@/features/interview-simulation/server/loaders/get-completed-reports-for-bill";
import { env } from "@/lib/env";
import { routes } from "@/lib/routes";

interface InterviewEditPageProps {
  params: Promise<{
    id: string;
    configId: string;
  }>;
}

export default async function InterviewEditPage({
  params,
}: InterviewEditPageProps) {
  const { id, configId } = await params;
  const [bill, config] = await Promise.all([
    getBillById(id),
    getInterviewConfigById(configId),
  ]);

  if (!bill || !config) {
    notFound();
  }

  const [questions, completedReportsResult, basics] = await Promise.all([
    getInterviewQuestions(config.id),
    getCompletedReportsForBill(bill.id),
    getProjectBasics(bill.id),
  ]);
  const template = getInterviewTemplate(config.template);

  return (
    <div>
      <div className="mb-6">
        <Link
          href={routes.interviews() as Route}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          インタビュー一覧に戻る
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">インタビューを編集</h1>
        <Badge className={TEMPLATE_BADGE_CLASSNAMES[template.key]}>
          {template.label}
        </Badge>
      </div>

      <div className="mb-6">
        <ProjectSettingsForm
          billId={bill.id}
          configId={config.id}
          respondentUrl={buildRespondentUrl(env.webUrl, bill.id)}
          initialValues={{
            title: basics?.title ?? bill.name,
            description: basics?.description ?? "",
            targetAudience: config.target_audience ?? "",
            reportVisibility: config.report_visibility,
            isListed: config.is_listed,
          }}
        />
      </div>

      <InterviewConfigEditClient
        billId={bill.id}
        config={config}
        questions={questions}
        completedReports={completedReportsResult.reports}
        completedReportsTruncated={completedReportsResult.isTruncated}
        completedReportsLimit={completedReportsResult.limit}
      />
    </div>
  );
}
