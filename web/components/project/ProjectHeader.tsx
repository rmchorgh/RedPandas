import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
type ProjectHeaderProps = {
  project: any;
};

function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="flex h-[13%] w-[100%] items-center rounded-xl bg-[white] p-5">
      <FontAwesomeIcon icon={faChevronLeft} size={"2xl"} />
      <div className={"flex flex-col text-2xl"}>
        <div>{JSON.stringify(project)}</div>
      </div>
    </div>
  );
}

export default ProjectHeader;
