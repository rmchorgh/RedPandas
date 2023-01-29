import React, { useState, useMemo, useEffect } from "react";
import {
  faTable,
  faChartSimple,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Commands from "./Commands";
import Dataset from "./Dataset";
import { commands } from "next/dist/lib/commands";
import { useAbly } from "../../lib/client/ably";
import Image from "next/image";
import CSVUploader from "./CSVUploader";

enum ACTIVESECTION {
  TABLE = "table",
  FIGURES = "figures",
}
const SENTINEL_VAL = -9999999;

export interface FiguresProps {
  datasets: { id: string; revision: number; name: string }[];
  plots: string[];
  projectId: string;
}

function Figures({ datasets, plots, projectId }: FiguresProps) {
  const [activeSection, setActiveSection] = useState<ACTIVESECTION>(
    ACTIVESECTION.TABLE
  );
  const [activeDataset, setActiveDataset] = useState(0);

  return (
    <div className="relative ml-auto h-[80%] w-[95%] rounded-lg border bg-[white] shadow-md">
      {/* SIDE */}
      <div
        className="absolute top-5 left-[-45px]
    flex h-[50px] w-[50px] cursor-pointer items-center
    justify-center rounded-md bg-[white]
    "
        onClick={() => setActiveSection(ACTIVESECTION.TABLE)}
      >
        <FontAwesomeIcon
          icon={faTable}
          size={"xl"}
          className={`${
            activeSection == ACTIVESECTION.TABLE
              ? "text-[gray-400]"
              : "text-[gray-50] opacity-50"
          } mr-1 transition-all`}
        />
      </div>
      <div
        className="absolute  top-20 left-[-45px]
    flex h-[50px] w-[50px] cursor-pointer items-center
    justify-center rounded-md bg-[white]
    "
        onClick={() => setActiveSection(ACTIVESECTION.FIGURES)}
      >
        <FontAwesomeIcon
          icon={faChartSimple}
          size={"xl"}
          className={`${
            activeSection == ACTIVESECTION.FIGURES
              ? "text-[gray-400]"
              : "text-[gray-50] opacity-50"
          } mr-1 transition-all`}
        />
      </div>
      {/* CONTENT */}
      <div className="hover flex h-[95%] w-[100%] flex-col items-center justify-center rounded-md p-5">
        {activeSection == ACTIVESECTION.TABLE && (
          <>
            <div
              className={
                "display  flex w-full min-w-[80vw] max-w-[80vw] flex-row items-end justify-items-end py-2 transition-all"
              }
            >
              <div
                className={
                  " absolute top-[-30px] left-2 z-[0] flex h-[40px] w-auto flex-row    flex-nowrap "
                }
              >
                {datasets.map((dataset, i: number) => {
                  if (i == datasets.length - 1) {
                    return (
                      <>
                        <div
                          key={dataset.id + i}
                          onClick={() => setActiveDataset(i)}
                          className={`w-[9vw] shrink cursor-pointer truncate text-ellipsis rounded-tr-xl rounded-tl-xl bg-violet-500 bg-[#FFFFFF] px-2 pt-2 text-xs transition-all ${
                            activeDataset == i
                              ? "text-[#5D5D5D]"
                              : "text-[#5D5D5Dac]"
                          }`}
                        >
                          {dataset.name}
                        </div>
                        <div
                          key={dataset.id + i}
                          onClick={() => setActiveDataset(SENTINEL_VAL)}
                          className={`align-items flex w-[3vw] shrink cursor-pointer items-center justify-center truncate text-ellipsis rounded-tr-xl rounded-tl-xl  bg-gray-200   px-2  text-xs transition-all 
                          `}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            size={"lg"}
                            className={``}
                          />
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <div
                        key={dataset.id + i}
                        onClick={() => setActiveDataset(i)}
                        className={`w-[9vw] shrink cursor-pointer truncate text-ellipsis rounded-tr-xl rounded-tl-xl  bg-[#FFFFFF] px-2 pt-2 text-xs transition-all z-[10]${
                          activeDataset == i
                            ? "text-[#5D5D5D]"
                            : "text-[#5D5D5Dac]"
                        }`}
                      >
                        {dataset.name}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <div className="z-[100] max-h-[100%] max-w-full  overflow-scroll text-[#5d5d5d]">
              {activeDataset != SENTINEL_VAL ? (
                <Dataset
                  datasetId={datasets[activeDataset].id}
                  revision={datasets[activeDataset].revision}
                />
              ) : (
                <CSVUploader projectId={projectId} />
              )}
            </div>
          </>
        )}
        {activeSection == ACTIVESECTION.FIGURES && (
          <div
            className="
          align-items flex grid h-full w-full grid-cols-3 flex-col  items-center justify-center
          gap-3 text-2xl text-[#FD7F2C]


          "
          >
            {plots.map((plot) => (
              <div key={plot}>
                <Image
                  className={
                    "border transition duration-1000 ease-in-out hover:animate-bounce "
                  }
                  src={plot}
                  alt="Plot"
                  width={640}
                  height={480}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Figures;
