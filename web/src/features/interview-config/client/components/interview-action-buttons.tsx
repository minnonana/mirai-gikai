"use client";

import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getInterviewChatLink } from "@/features/interview-config/shared/utils/interview-links";
import { NewInterviewButton } from "@/features/interview-session/client/components/new-interview-button";
import { RestartInterviewButton } from "@/features/interview-session/client/components/restart-interview-button";
import type { LatestInterviewSession } from "@/features/interview-session/server/loaders/get-latest-interview-session";
import type { ReportVisibility } from "../../shared/utils/respondent-copy";
import { InterviewConsentModal } from "./interview-consent-modal";

interface InterviewActionButtonsProps {
  billId: string;
  sessionInfo: LatestInterviewSession | null;
  previewToken?: string;
  reportVisibility?: ReportVisibility;
}

export function InterviewActionButtons({
  billId,
  sessionInfo,
  previewToken,
  reportVisibility,
}: InterviewActionButtonsProps) {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const isActive = sessionInfo?.status === "active";
  const isCompleted = sessionInfo?.status === "completed";

  // 完了済みの場合：「もう一度新たに回答する」ボタン（確認ダイアログなし）
  if (isCompleted && sessionInfo?.reportId) {
    return <NewInterviewButton billId={billId} previewToken={previewToken} />;
  }

  // 進行中の場合は直接遷移
  if (isActive) {
    const chatLink = getInterviewChatLink(billId, previewToken);

    return (
      <>
        <Button
          asChild
          className="w-full bg-primary text-primary-foreground rounded-full h-[54px] px-6 font-bold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
        >
          <Link href={chatLink as Route}>
            <span>続きから再開する</span>
            <ArrowRight className="size-5" />
          </Link>
        </Button>
        <RestartInterviewButton
          sessionId={sessionInfo.id}
          billId={billId}
          previewToken={previewToken}
        />
      </>
    );
  }

  // 新規の場合はモーダルを表示
  return (
    <>
      <Button
        onClick={() => setShowConsentModal(true)}
        className="w-full bg-primary text-primary-foreground rounded-full h-[54px] px-6 font-bold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
      >
        <span>インタビューをはじめる</span>
        <ArrowRight className="size-5" />
      </Button>

      <InterviewConsentModal
        open={showConsentModal}
        onOpenChange={setShowConsentModal}
        billId={billId}
        previewToken={previewToken}
        reportVisibility={reportVisibility}
      />
    </>
  );
}
