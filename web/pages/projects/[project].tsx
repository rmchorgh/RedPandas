import { useRouter } from "next/router";
import Dataset from "../../components/project/Dataset";
import Commands from "../../components/project/Commands";
import Link from "next/link";
import ProjectHeader from "../../components/project/ProjectHeader";

export default function Project() {
  gghgfuyfuyiyguyfgh;
  return (
    <>
      <div className={"dotted absolute top-0 left-0 h-[100vh] w-[100vw]"}></div>
      <div
        className={
          "bottom top-0 left-0 flex h-[100vh] w-[100vw] flex-row bg-[#F6F5F8] p-2"
        }
      >
        <div className={" h-full min-w-[65%] bg-[blue] px-8 py-5"}>
          <ProjectHeader project={router} />
          <div className={"h-full w-full border"}></div>
        </div>

        <div className={"h-full w-[50%] bg-red-500 p-5"}>
          <div className={"h-full w-full border"}></div>
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
