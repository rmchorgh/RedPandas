import Link from "next/link";
import React from "react";
import { faTerminal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ProjectContProps = {
  href: string;
  name: string;
};

function ProjectCont({ href, name }: ProjectContProps) {
  return (
    <Link
      href={href}
      className="card-hovered flex h-[250px] w-[250px] flex-col justify-between  rounded-lg border bg-white px-5 hover:border-[#FD7F2C] hover:text-[#FD7F2C]"
    >
      <div>
        <div className=" mt-5 font-sans text-lg font-semibold text-[rgba(0,0,0,0.63)] ">
          {name}
        </div>
      </div>
      <div className="pb-3">
        <FontAwesomeIcon icon={faTerminal} size={"1x"} />
      </div>
    </Link>
  );
}

export default ProjectCont;
