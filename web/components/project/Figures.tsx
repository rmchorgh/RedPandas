import React, { useState } from "react";
import { faTable, faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Commands from "./Commands";
import Dataset from "./Dataset";

enum ACTIVESECTION {
  TABLE = "table",
  FIGURES = "figures",
}

type FiguresProps = {
  projectId: string;
}

function Figures({projectId}: FiguresProps) {
  const [activeSection, setActiveSection] = useState<ACTIVESECTION>(ACTIVESECTION.TABLE);



  return (
  <div className="bg-[#F6F5F8] h-[80%]  rounded-lg relative w-[95%] ml-auto">
    {/* SIDE */}
    <div className="bg-[#F6F5F8] h-[50px] w-[50px] 
    absolute top-5 left-[-45px] rounded-md cursor-pointer
    justify-center items-center flex
    "
    onClick={() => setActiveSection(ACTIVESECTION.TABLE)}
    >
      <FontAwesomeIcon icon={faTable} size={"xl"} className={`${activeSection == ACTIVESECTION.TABLE ? "text-[#FD7F2C]" : "text-[#FD7F2Cac] transition-all"} mr-1`} />

    </div>
    <div className="bg-[#F6F5F8]  h-[50px] w-[50px] 
    absolute top-20 left-[-45px] rounded-md cursor-pointer
    justify-center items-center flex
    "
    onClick={() => setActiveSection(ACTIVESECTION.FIGURES)}
    >
      <FontAwesomeIcon icon={faChartSimple} size={"xl"} className={`${activeSection == ACTIVESECTION.FIGURES ? "text-[#FD7F2C]" : "text-[#FD7F2Cac] transition-all"} mr-1`} />
    </div>

    {/* CONTENT */}
    <div className="h-[100%] w-[100%] flex flex-col justify-center items-center">
      {activeSection == ACTIVESECTION.TABLE && <div className="text-[#FD7F2C] text-2xl">
      <Dataset projectId={projectId} />
      {/* <Commands projectId={projectId} /> */}
        </div>}
      {activeSection == ACTIVESECTION.FIGURES && <div className="text-[#FD7F2C] text-2xl">Figures</div>}
    </div>


  </div>);
}

export default Figures;
