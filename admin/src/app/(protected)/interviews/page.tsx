import { Plus } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentAdmin } from "@/features/auth/server/lib/auth-server";
import { InterviewProjectList } from "@/features/interview-projects/server/components/interview-project-list";
import { getInterviewProjects } from "@/features/interview-projects/server/loaders/get-interview-projects";
import { routes } from "@/lib/routes";

export default async function InterviewsPage() {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect(routes.login());
  }

  const { projects, responseCounts } = await getInterviewProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">インタビュー</h1>
          <p className="text-sm text-gray-600">
            作成したAIインタビューの一覧です。
          </p>
        </div>
        <Button asChild>
          <Link href={routes.interviewNew() as Route}>
            <Plus className="h-4 w-4" />
            新しいインタビューを作る
          </Link>
        </Button>
      </div>

      <InterviewProjectList
        projects={projects}
        responseCounts={responseCounts}
      />
    </div>
  );
}
