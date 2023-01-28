import { trpc } from "../../lib/client/trpc";
import ErrorMessage from "../ErrorMessage";
import { z } from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export interface RunCommandProps {
  projectId: string;
  onSuccess?: () => void;
}

export default function RunCommand({ onSuccess, projectId }: RunCommandProps) {
  const { mutate, error } = trpc.project.runCommand.useMutation({ onSuccess });

  const {register, handleSubmit, formState} = useForm({
    defaultValues: {
      input: "",
    },
    resolver: zodResolver(z.object({ input: z.string().min(1) })),
  });

  return (
    <>
      {error && <ErrorMessage />}
      <form
        onSubmit={handleSubmit((values) => mutate({ projectId, ...values }))}
        noValidate
      >
        <input {...register("input")} />
        {formState.errors.input?.message && <p>{formState.errors.input.message}</p>}
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
