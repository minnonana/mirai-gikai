"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { isInterviewPage } from "@/lib/page-layout-utils";
import { routes } from "@/lib/routes";
import { policyLinks, primaryLinks } from "./footer.config";

export function Footer() {
  const pathname = usePathname();

  if (isInterviewPage(pathname)) {
    return null;
  }

  return (
    <footer className="bg-mirai-gradient text-slate-900">
      <div className="mx-auto flex w-full max-w-[500px] flex-col items-center px-6 py-14 pb-20 text-center">
        <FooterLogoSection />
        <FooterPrimaryLinks />
        <FooterPolicies />
        <FooterForkNotice />
        <FooterCopyright />
      </div>
    </footer>
  );
}

function FooterLogoSection() {
  return (
    <div className="flex flex-col items-center text-center mb-9">
      <Link href={routes.home()} aria-label="TENJO インタビュー トップページ">
        <Image
          src="/img/logo.svg"
          alt="TENJO インタビュー"
          width={128}
          height={128}
          className="h-auto"
        />
      </Link>
    </div>
  );
}

function FooterPrimaryLinks() {
  return (
    <nav aria-label="主要リンク" className="w-full mb-5">
      <ul
        className="
      flex flex-col items-center gap-3 text-[14px] font-semibold text-slate-800
      md:flex-row md:justify-center md:gap-5
      "
      >
        {primaryLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href as Route}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="transition-colors hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterPolicies() {
  return (
    <div className="flex flex-col items-center text-[12px] font-semibold text-slate-800 mb-5">
      <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1">
        {policyLinks.map((policy, index) => (
          <li key={policy.label} className="flex items-center gap-2">
            <Link
              href={policy.href as Route}
              target={policy.external ? "_blank" : undefined}
              rel={policy.external ? "noreferrer" : undefined}
              className="transition-colors hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {policy.label}
            </Link>
            {index < policyLinks.length - 1 ? <span>｜</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * fork ガイドラインで求められる免責文言と、fork 元・ソースコードへのリンク
 */
function FooterForkNotice() {
  const linkClass = "underline underline-offset-2 hover:text-slate-900";
  return (
    <div className="mb-5 flex flex-col gap-1 text-[12px] leading-relaxed text-slate-800">
      <p className="font-semibold">
        これは政党チームみらいが運営しているものではありません
      </p>
      <p>
        本サービスは、チームみらいが公開している
        <a
          href={EXTERNAL_LINKS.UPSTREAM_SITE}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          「みらい議会」
        </a>
        の
        <a
          href={EXTERNAL_LINKS.UPSTREAM_REPO}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          ソースコード
        </a>
        （AGPL-3.0）を改変して、TENJO KANAZAWAが運営しています。改変後の
        <a
          href={EXTERNAL_LINKS.GITHUB_REPO}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          ソースコードはこちら
        </a>
        で公開しています。
      </p>
    </div>
  );
}

function FooterCopyright() {
  return (
    <div className="text-center text-sm font-medium text-slate-800">
      © 2026 TENJO KANAZAWA
    </div>
  );
}
