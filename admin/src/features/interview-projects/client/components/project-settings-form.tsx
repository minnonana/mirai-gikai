"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateInterviewProjectSettings } from "../../server/actions/update-interview-project-settings";
import type {
  InterviewProjectSettingsInput,
  ReportVisibility,
} from "../../shared/schemas";

interface ProjectSettingsFormProps {
  billId: string;
  configId: string;
  initialValues: InterviewProjectSettingsInput;
  /** 回答者向けページのURL（受付中のときだけ回答できる） */
  respondentUrl: string;
}

const VISIBILITY_OPTIONS: {
  value: ReportVisibility;
  label: string;
  hint: string;
}[] = [
  { value: "private", label: "公開しない", hint: "運営者だけが読みます" },
  {
    value: "consented",
    label: "同意した人の回答だけ公開",
    hint: "回答の最後に公開してよいか確認します",
  },
];

export function ProjectSettingsForm({
  billId,
  configId,
  initialValues,
  respondentUrl,
}: ProjectSettingsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [isPending, startTransition] = useTransition();

  const update = <K extends keyof InterviewProjectSettingsInput>(
    key: K,
    value: InterviewProjectSettingsInput[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateInterviewProjectSettings(
        billId,
        configId,
        values
      );
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("基本情報を保存しました");
      router.refresh();
    });
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(respondentUrl);
      toast.success("回答用のURLをコピーしました");
    } catch {
      toast.error("コピーできませんでした。URLを選択してコピーしてください");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>基本情報と公開設定</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="project-title">タイトル</Label>
          <Input
            id="project-title"
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            maxLength={120}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="project-description">回答者への説明</Label>
          <Textarea
            id="project-description"
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            maxLength={1000}
          />
          <p className="text-xs text-gray-600">
            回答者が最初に見る案内ページに表示します。AIもこの説明を前提に質問します。
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="project-target">対象者</Label>
          <Input
            id="project-target"
            value={values.targetAudience}
            onChange={(e) => update("targetAudience", e.target.value)}
            placeholder="例：ツアーに参加した方"
            maxLength={100}
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold">回答の公開</legend>
          {VISIBILITY_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-2 text-sm"
            >
              <input
                type="radio"
                name="report-visibility"
                value={option.value}
                checked={values.reportVisibility === option.value}
                onChange={() => update("reportVisibility", option.value)}
                className="mt-1"
              />
              <span>
                {option.label}
                <span className="block text-xs text-gray-600">
                  {option.hint}
                </span>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="flex items-start gap-2">
          <Checkbox
            id="project-listed"
            checked={values.isListed}
            onCheckedChange={(checked) => update("isListed", checked === true)}
          />
          <Label
            htmlFor="project-listed"
            className="flex flex-col items-start gap-1"
          >
            <span>公開サイトのトップに表示する</span>
            <span className="text-xs font-normal text-gray-600">
              表示しない場合も、配布したURLからは回答できます
            </span>
          </Label>
        </div>

        <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-4">
          <Label htmlFor="project-url">回答用のURL</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="project-url"
              value={respondentUrl}
              readOnly
              className="font-mono text-xs"
            />
            <Button type="button" variant="outline" onClick={handleCopyUrl}>
              コピー
            </Button>
          </div>
          <p className="text-xs text-gray-600">
            下の「インタビュー設定」で状態を「公開」にすると、このURLから回答できるようになります。
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isPending || values.title.trim().length === 0}
          className="self-start"
        >
          {isPending ? "保存中…" : "基本情報を保存"}
        </Button>
      </CardContent>
    </Card>
  );
}
