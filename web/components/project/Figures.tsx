import React, { useState, useMemo } from "react";
import {
  faTable,
  faChartSimple,
  faEye,
  faEyeSlash,
  fa0,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Commands from "./Commands";
import Dataset from "./Dataset";
import { commands } from "next/dist/lib/commands";
import { useAbly } from "../../lib/client/ably";

enum ACTIVESECTION {
  TABLE = "table",
  FIGURES = "figures",
}

export interface FiguresProps {
  datasets: { id: string; revision: number; name: string }[];
}

function Figures({ datasets }: FiguresProps) {
  const [activeSection, setActiveSection] = useState<ACTIVESECTION>(
    ACTIVESECTION.TABLE
  );
  const [truncated, setTruncated] = useState(false);
  const [activeDataset, setActiveDataset] = useState(0);

  const dummyArray = useMemo(() => {
    return [
      ...datasets,
      ...datasets,
      ...datasets,
      ...datasets,
      ...datasets,

      ...datasets,

      ...datasets,
    ];
  }, [datasets]);

  return (
    <div className="relative ml-auto h-[80%] w-[95%] rounded-lg border bg-[white]">
      {/* SIDE */}
      <div
        className="absolute top-5 left-[-45px]
    flex h-[50px] w-[50px] cursor-pointer items-center
    justify-center rounded-md bg-[#F6F5F8]
    "
        onClick={() => setActiveSection(ACTIVESECTION.TABLE)}
      >
        <FontAwesomeIcon
          icon={faTable}
          size={"xl"}
          className={`${
            activeSection == ACTIVESECTION.TABLE
              ? "text-[#FD7F2C]"
              : "text-[#FD7F2Cac] transition-all"
          } mr-1`}
        />
      </div>
      <div
        className="absolute  top-20 left-[-45px]
    flex h-[50px] w-[50px] cursor-pointer items-center
    justify-center rounded-md bg-[#F6F5F8]
    "
        onClick={() => setActiveSection(ACTIVESECTION.FIGURES)}
      >
        <FontAwesomeIcon
          icon={faChartSimple}
          size={"xl"}
          className={`${
            activeSection == ACTIVESECTION.FIGURES
              ? "text-[#FD7F2C]"
              : "text-[#FD7F2Cac] transition-all"
          } mr-1`}
        />
      </div>
      {/* CONTENT */}
      <div className="hover flex h-[95%] w-[100%] flex-col items-center justify-center rounded-md">
        {activeSection == ACTIVESECTION.TABLE && (
          <>
            <div
              className={
                "display relative flex w-full min-w-[80vw] max-w-[80vw] flex-row items-end justify-items-end py-2 transition-all"
              }
            >
              <div
                className={
                  " absolute top-[-35px] left-[12vw] flex h-[40px] w-auto flex-row flex-nowrap     "
                }
              >
                {dummyArray.map((dataset, i: number) => (
                  <div
                    key={dataset.id + i}
                    onClick={() => setActiveDataset(i)}
                    className={`w-[5vw] shrink cursor-pointer truncate text-ellipsis rounded-tr-xl rounded-tl-xl bg-[#FFFFFF] px-2 pt-2 text-xs transition-all ${
                      activeDataset == i ? "text-[#5D5D5D]" : "text-[#5D5D5Dac]"
                    }`}
                  >
                    {dataset.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="max-h-[100%] max-w-full overflow-scroll  text-[#5d5d5d]">
              <Dataset
                datasetId={dummyArray[activeDataset].id}
                revision={dummyArray[activeDataset].revision}
              />
            </div>
          </>
        )}
        {activeSection == ACTIVESECTION.FIGURES && (
          <div className="min-w-[80vw] max-w-[80vw] text-2xl text-[#FD7F2C]">
            Figures
          </div>
        )}
      </div>
    </div>
  );
}

export default Figures;
