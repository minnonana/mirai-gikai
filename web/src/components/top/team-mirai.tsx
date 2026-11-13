import Image from "next/image";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { LinkButton } from "./link-button";

/**
 * 運営者（TENJO KANAZAWA）の紹介セクション
 */
export function TeamMirai() {
  return (
    <div className="py-10">
      <div className="flex flex-col gap-6">
        {/* ヘッダー */}
        <div className="flex flex-col gap-4">
          <h2>
            <Image
              src="/img/logo-full.png"
              alt="TENJO KANAZAWA"
              width={263}
              height={94}
              priority
            />
          </h2>
          <p className="text-sm font-bold text-primary-accent">
            TENJO KANAZAWAについて
          </p>
        </div>

        {/* コンテンツ */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-[15px] leading-[28px] text-black">
              TENJO議会は、TENJO KANAZAWAが運営しています。
            </p>
            <p className="text-[13px] leading-[24px] text-mirai-text-note">
              これは政党チームみらいが運営しているものではありません。チームみらいが公開している「みらい議会」のソースコード（AGPL-3.0）を改変して作られています。
            </p>
          </div>

          {/* ボタングループ */}
          <div className="flex flex-col gap-4">
            <LinkButton
              href={EXTERNAL_LINKS.UPSTREAM_SITE}
              icon={{
                src: "/icons/info-icon.svg",
                alt: "",
                width: 23,
                height: 22,
              }}
            >
              本家「みらい議会」を見る
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
