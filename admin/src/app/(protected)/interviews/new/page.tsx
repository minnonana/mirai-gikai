import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { TemplatePicker } from "@/features/interview-projects/client/components/template-picker";
import { routes } from "@/lib/routes";

export default function InterviewNewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href={routes.interviews() as Route}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          インタビュー一覧
        </Link>
        <h1 className="text-2xl font-bold">どんなインタビューを作りますか？</h1>
        <p className="text-sm text-gray-600">
          用途を選ぶと、質問とAIの聞き方が最初から入った状態で始まります。あとから自由に変えられます。
        </p>
      </div>

      <TemplatePicker />
    </div>
  );
}
