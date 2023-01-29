import { trpc } from "../../lib/client/trpc";
import ErrorMessage from "../ErrorMessage";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { faArrowTurnDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface RunCommandProps {
  projectId: string;
  onSuccess?: () => void;
  gpt: boolean;
  setGpt: (gpt: boolean) => void;
}

export default function RunCommand({
  onSuccess,
  projectId,
  gpt,
  setGpt,
}: RunCommandProps) {
  const { mutate, error } = trpc.project.runCommand.useMutation({ onSuccess });
  const { mutate: generate, error: genError } =
    trpc.project.chatGPT.useMutation({
      onSuccess: (data) => {
        console.log(data);
        setValue("input", data[0].text);
        setGpt(false);
      },
    });

  const { register, handleSubmit, formState, reset, setValue } = useForm({
    defaultValues: {
      input: "",
    },
    resolver: zodResolver(z.object({ input: z.string().min(1) })),
  });

  return (
    <>
      {error && <ErrorMessage />}
      <form
        onSubmit={handleSubmit((values) => {
          if (gpt) generate({ projectId, ...values });
          else mutate({ projectId, ...values });
          reset();
        })}
        noValidate
        className={"relative"}
      >
        <input
          {...register("input")}
          className="no-ring mb-3 h-[4rem] w-full rounded-md border bg-gray-300  py-2 px-3 pr-12 text-black outline-none"
          placeholder={
            gpt ? "Type a natural language prompt" : "Enter a Python command..."
          }
        />
        <FontAwesomeIcon
          icon={faArrowTurnDown}
          size={"md"}
          className={"absolute top-6 right-6 rotate-90 opacity-50"}
        />
        {formState.errors.input?.message && (
          <p className={"w-[40%] bg-green-200 "}>
            {formState.errors.input.message}
          </p>
        )}
        <input type="submit" className="hidden" />
      </form>
    </>
  );
}
