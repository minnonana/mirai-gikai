import { getInterviewTemplate } from "@mirai-gikai/shared/interview-templates/templates";
import type { Route } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InterviewConfigWithBill } from "@/features/interview-config/server/repositories/interview-config-repository";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { REPORT_VISIBILITY_LABELS } from "../../shared/schemas";
import {
  getInterviewProjectStatus,
  INTERVIEW_PROJECT_STATUS_LABELS,
  type InterviewProjectStatus,
} from "../../shared/utils/interview-project-status";
import { TEMPLATE_BADGE_CLASSNAMES } from "../../shared/utils/template-badge";

const STATUS_DOT_CLASSNAMES: Record<InterviewProjectStatus, string> = {
  open: "bg-green-600",
  draft: "border-2 border-gray-400",
  ended: "bg-gray-400",
};

interface InterviewProjectListProps {
  projects: InterviewConfigWithBill[];
  responseCounts: Record<string, number> | null;
}

export function InterviewProjectList({
  projects,
  responseCounts,
}: InterviewProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-lg border bg-white py-16 text-center text-gray-600">
        まだインタビューがありません。「新しいインタビューを作る」から始めましょう。
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>用途</TableHead>
            <TableHead>状態</TableHead>
            <TableHead>回答の公開</TableHead>
            <TableHead className="text-right">回答数</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const template = getInterviewTemplate(project.template);
            const status = getInterviewProjectStatus(project);
            // 集計に失敗したときだけ「-」。回答が無い案件は 0 と出す
            const count = responseCounts
              ? (responseCounts[project.id] ?? 0)
              : null;
            return (
              <TableRow key={project.id}>
                <TableCell className="font-semibold">
                  {project.bill.name}
                </TableCell>
                <TableCell>
                  <Badge className={TEMPLATE_BADGE_CLASSNAMES[template.key]}>
                    {template.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        STATUS_DOT_CLASSNAMES[status]
                      )}
                    />
                    {INTERVIEW_PROJECT_STATUS_LABELS[status]}
                  </span>
                </TableCell>
                <TableCell className="text-gray-700">
                  {REPORT_VISIBILITY_LABELS[project.report_visibility]}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {count ?? "-"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-4 whitespace-nowrap text-sm font-semibold text-blue-700">
                    {status !== "draft" && (
                      <Link
                        href={
                          routes.billReports(
                            project.bill_id,
                            project.id
                          ) as Route
                        }
                        className="hover:underline"
                      >
                        結果を見る
                      </Link>
                    )}
                    <Link
                      href={
                        routes.billInterviewEdit(
                          project.bill_id,
                          project.id
                        ) as Route
                      }
                      className="hover:underline"
                    >
                      編集
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
