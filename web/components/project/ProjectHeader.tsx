import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Link from "next/link";
type ProjectHeaderProps = {
  name: string;
};

function ProjectHeader({ name }: ProjectHeaderProps) {
  const router = useRouter();
  return (
    <div className="flex h-[13%] w-[100%] items-center rounded-xl bg-[white] p-5 text-[#5d5d5d] shadow-md">
      <Link href="/">
        <FontAwesomeIcon icon={faChevronLeft} size={"2xl"} />
      </Link>
      <div className={"ml-2 flex flex-col "}>
        <div className="text-2xl">{name}</div>
        <div className="text-md ">{router.query.project}</div>
      </div>
    </div>
  );
}

export default ProjectHeader;
