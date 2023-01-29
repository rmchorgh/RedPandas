import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDatasetSchema,
  createProjectSchema,
  objectIdSchema,
} from "../../lib/schemas";
import ErrorMessage from "../ErrorMessage";
import { useMemo } from "react";
import { trpc } from "../../lib/client/trpc";
import { z } from "zod";

export interface CSVUploaderProps {
  projectId: string;
}

function CSVUploader({ projectId }: CSVUploaderProps) {
  const utils = trpc.useContext();
  const { mutate, error } = trpc.project.addDataset.useMutation({
    onSuccess() {
      utils.project.get.invalidate();
    },
  });
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      datasetId: "",
    },
    resolver: zodResolver(
      z.object({
        datasetId: z.string().uuid(),
      })
    ),
  });

  return (
    <div className="flex h-[50vh] w-[40vw] flex-col justify-center  ">
      <div className="mt-5 mb-10 pr-20 text-xl font-medium text-black">
        Upload the dataset ID <br></br> from the RedPandas CLI.
      </div>

      <div className="mt-10 mb-10 flex items-center">
        {error && <ErrorMessage />}
        <form
          onSubmit={handleSubmit((values) => mutate({ projectId, ...values }))}
          noValidate
          className={
            "flex h-[30vh] w-[34vw] flex-col gap-10  text-2xl font-semibold"
          }
        >
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

          <button
            type="submit"
            className="mr-auto mt-10 w-auto rounded-md border py-4 px-14 text-xs"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CSVUploader;
