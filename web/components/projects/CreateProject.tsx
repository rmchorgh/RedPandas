import { trpc } from "../../lib/client/trpc";
import ErrorMessage from "../ErrorMessage";
import { createProjectSchema } from "../../lib/schemas";
import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

export default function CreateProject() {
  const router = useRouter();
  const { mutate, error } = trpc.project.create.useMutation({
    onSuccess(data) {
      router.push(`/projects/${data._id}`);
    },
  });
  const [opened, setOpened] = useState(false);

  const { register, handleSubmit, formState, getValues } = useForm({
    defaultValues: {
      name: "",
      datasetId: "",
      revisionId: "",
    },
    resolver: zodResolver(createProjectSchema),
  });

  const buttonDisabled = useMemo(() => {
    return (
      !!(
        formState.errors.name ||
        formState.errors.datasetId ||
        formState.errors.revisionId
      ) || !formState.touchedFields
    );
  }, [formState.errors]);

  // @ts-ignore
  return (
    <>
      <div
        className="card-hovered z-[3] flex h-[250px] w-[250px]
    flex-col items-center justify-center rounded-lg
    border bg-white hover:border-[#FD7F2C] hover:text-[#FD7F2C] hover:shadow-md"
        onClick={() => setOpened(!opened)}
      >
        <FontAwesomeIcon icon={faPlus} size={"4x"} />
        <div className=" mt-10 font-sans text-xl font-semibold hover:text-[#FD7F2C]">
          New Project
        </div>
      </div>
      <div
        className={`h-full w-full bg-white 
        ${opened ? "z-[100]" : "z-[-100]"}  
        right absolute top-0 left-0 flex
        flex-row px-32 py-20 transition-all
        `}
      >
        {/* <div onClick={() => setOpened(false)}>
          close me
        </div> */}

        <div className="50% flex h-full w-full flex-col ">
          <div>
            <div className="flex items-center ">
              <FontAwesomeIcon
                icon={faXmark}
                size={"2x"}
                className="cursor-pointer text-[#808080]"
                onClick={() => setOpened(false)}
              />
              <div className="ml-3 text-xl font-semibold text-[#808080] ">
                Create a project{" "}
              </div>
            </div>
            <div className="mt-5 mb-10 pr-20 text-xl font-medium text-black">
              Fill up some important information! <br></br> Use the RedPandas
              CLI.
            </div>
          </div>

          <div className="mt-10 mb-10 flex items-center">
            {error && <ErrorMessage />}
            <form
              onSubmit={handleSubmit((values) => mutate(values))}
              noValidate
              className={
                "flex h-[30vh] w-[34vw] flex-col gap-10  text-2xl font-semibold"
              }
            >
              <input
                {...register("name")}
                className={`no-ring border-b pb-2 outline-none transition-all focus:border-black focus:text-black
               
                `}
                placeholder={"Project Name"}
                required
              />
              {formState.errors.name?.message && (
                <p className={"mt-[-3vh] text-sm text-[#FD7F2C]"}>
                  {formState.errors.name.message}
                </p>
              )}

              <input
                {...register("datasetId")}
                className={
                  "no-ring border-b outline-none transition-all focus:text-black"
                }
                placeholder={"Dataset ID"}
                required
              />
              {formState.errors.datasetId?.message && (
                <p className={"mt-[-3vh] text-sm text-[#FD7F2C]"}>
                  {formState.errors.datasetId.message}
                </p>
              )}

              <input
                {...register("revisionId")}
                className={
                  "no-ring border-b outline-none transition-all focus:text-black"
                }
                placeholder={"Revision ID"}
                required
              />
              {formState.errors.revisionId?.message && (
                <p className={"mt-[-3vh] text-sm text-[#FD7F2C]"}>
                  {formState.errors.revisionId.message}
                </p>
              )}

              <button
                type="submit"
                className={`
                mr-auto mt-10 w-auto rounded-md border py-4 px-14 text-xs 
                ${buttonDisabled ? "bg-gray-200" : "transparent"}
                
                
                `}
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="50% h-full w-full bg-yellow-500"></div>
      </div>
    </>
  );
}
