import { trpc } from "../../lib/client/trpc";
import { useForm, zodResolver } from "@mantine/form";
import ErrorMessage from "../ErrorMessage";
import { Button, TextInput } from "@mantine/core";
import { z } from "zod";

export interface RunCommandProps {
  projectId: string;
  onSuccess?: () => void;
}

export default function RunCommand({ onSuccess, projectId }: RunCommandProps) {
  const { mutate, error } = trpc.project.runCommand.useMutation({ onSuccess });

  const form = useForm({
    initialValues: {
      input: "",
    },
    validate: zodResolver(z.object({ input: z.string().min(1) })),
  });

  return (
    <>
      {error && <ErrorMessage />}
      <form
        onSubmit={form.onSubmit((values) => mutate({ projectId, ...values }))}
        noValidate
      >
        <TextInput label="Input" {...form.getInputProps("input")} />
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
}
