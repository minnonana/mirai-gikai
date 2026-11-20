"use client";

import {
  INTERVIEW_TEMPLATES,
  type InterviewTemplateKey,
  SELECTABLE_TEMPLATE_KEYS,
} from "@mirai-gikai/shared/interview-templates/templates";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { createInterviewProject } from "../../server/actions/create-interview-project";
import { TEMPLATE_BADGE_CLASSNAMES } from "../../shared/utils/template-badge";

export function TemplatePicker() {
  const router = useRouter();
  const [selected, setSelected] =
    useState<InterviewTemplateKey>("post_use_survey");
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createInterviewProject({
        template: selected,
        title,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("インタビューを作りました。質問と説明を確認してください");
      router.push(
        routes.billInterviewEdit(
          result.data.billId,
          result.data.configId
        ) as Route
      );
    });
  };

  const options: InterviewTemplateKey[] = [
    ...SELECTABLE_TEMPLATE_KEYS,
    "blank",
  ];

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="grid gap-4 md:grid-cols-3">
        <legend className="sr-only">用途</legend>
        {options.map((key) => {
          const template = INTERVIEW_TEMPLATES[key];
          const isSelected = selected === key;
          return (
            <label
              key={key}
              className={cn(
                "flex cursor-pointer flex-col gap-3 rounded-xl border bg-white p-5 transition-colors",
                key === "blank" && "md:col-span-3",
                isSelected
                  ? "border-2 border-blue-700"
                  : "border-gray-200 hover:border-gray-400"
              )}
            >
              <input
                type="radio"
                name="template"
                value={key}
                checked={isSelected}
                onChange={() => setSelected(key)}
                className="sr-only"
              />
              <div className="flex items-center justify-between gap-2">
                <Badge className={TEMPLATE_BADGE_CLASSNAMES[key]}>
                  {template.label}
                </Badge>
                {template.questions.length > 0 && (
                  <span className="text-xs text-gray-600">
                    約{template.estimatedMinutes}分・質問
                    {template.questions.length}つ
                  </span>
                )}
              </div>
              <div className="text-base font-bold leading-relaxed">
                {template.headline}
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-bold text-gray-600">
                  AIが聞くこと
                </span>
                <span className="text-gray-800">{template.asks}</span>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-xs font-bold text-gray-600">
                  まとめに入る項目
                </span>
                <span className="text-gray-800">
                  {template.summaryItems.join("、")}
                </span>
              </div>
            </label>
          );
        })}
      </fieldset>

      <div className="flex flex-col gap-3 rounded-xl border bg-white p-5 md:flex-row md:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="project-title">インタビューのタイトル</Label>
          <Input
            id="project-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：夜の街歩きツアー 参加後アンケート"
            maxLength={120}
          />
        </div>
        <Button
          onClick={handleCreate}
          disabled={isPending || title.trim().length === 0}
          className="md:w-auto"
        >
          {isPending ? "作成中…" : "このテンプレートで作る"}
        </Button>
      </div>
    </div>
  );
}
