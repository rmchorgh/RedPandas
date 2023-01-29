import { useRouter } from "next/router";
import ProjectHeader from "../../components/project/ProjectHeader";
import Figures from "../../components/project/Figures";
import { trpc } from "../../lib/client/trpc";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import { useAbly } from "../../lib/client/ably";
import Commands from "../../components/project/Commands";
import React from "react";

export default function Project() {
  const router = useRouter();
  const { data, error } = trpc.project.get.useQuery({
    projectId: router.query.project as string,
  });

  useAbly(router.query.project as string, data?.encKey);

  if (error) return <ErrorMessage />;
  if (!data) return <Loading />;

  return (
    <>
      <div
        className={
          "dotted pointer-events-none fixed absolute top-0 left-0 h-[100vh] w-[100vw] overflow-hidden"
        }
      ></div>
      <div
        className={
          "bottom top-0 left-0 flex h-[100vh] w-[100vw] flex-row bg-[#F6F5F8] p-2"
        }
      >
        <div
          className={
            " flex h-full w-[65%] flex-col justify-between  px-8 py-5 "
          }
        >
          <ProjectHeader name={data.name} />
          <Figures datasets={data.commands[data.revision].datasets} />
          {/* <div className={"h-full w-full border"}></div> */}
        </div>

        <div className={"h-full min-w-[45%]  p-5"}>
          <div className={"h-full w-full border"}>
            <Commands
              commands={data.commands}
              runningCommandInput={data.runningCommandInput}
              projectId={router.query.project as string}
            />
          </div>
        </div>
        {/*<div>*/}
        {/*  <Link href="/">Projects</Link>*/}
        {/*  <p>{router.query.project}</p>*/}
        {/*</div>*/}
        {/*<div>*/}
        {/*  <div>*/}
        {/*    <Dataset projectId={router.query.project as string} />*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <Commands projectId={router.query.project as string} />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </>
  );
}
