import { LinkButton } from "@/components/top/link-button";
import { routes } from "@/lib/routes";

/**
 * デスクトップメニュー: アクションボタン（サイドバー内）
 */
export function DesktopMenuActionButtons() {
  return (
    <div className="flex flex-col gap-3">
      <LinkButton
        href={routes.developers()}
        icon={{
          src: "/icons/info-icon.svg",
          alt: "",
          width: 20,
          height: 20,
        }}
      >
        開発者向け情報
      </LinkButton>
    </div>
  );
}
