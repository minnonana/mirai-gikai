import { Container } from "@/components/layouts/container";
import { TeamMirai } from "@/components/top/team-mirai";
import { ListedInterviewList } from "@/features/interview-config/server/components/listed-interview-list";
import { getListedInterviews } from "@/features/interview-config/server/loaders/get-listed-interviews";

export default async function Home() {
  const interviews = await getListedInterviews();

  return (
    <Container>
      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-10 pb-6 pt-24 md:pt-4">
        <section className="flex flex-col gap-3">
          <h1 className="text-[25px] font-black leading-normal">
            あなたの声を、
            <br />
            AIがていねいに聞き取ります
          </h1>
          <p className="text-sm leading-[1.8] text-mirai-text-note">
            チャットで質問に答えるだけ。所要時間は3〜10分ほどです。いただいた声は、サービスやイベントをよくするために使われます。
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-[15px] font-bold">回答受付中のインタビュー</h2>
          <ListedInterviewList interviews={interviews} />
        </section>

        <TeamMirai />
      </div>
    </Container>
  );
}
