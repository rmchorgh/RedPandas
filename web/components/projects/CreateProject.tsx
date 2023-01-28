import { Button, TextInput } from "@mantine/core";
import { trpc } from "../../lib/client/trpc";
import ErrorMessage from "../ErrorMessage";
import { createProjectSchema } from "../../lib/schemas";
import { useForm, zodResolver } from "@mantine/form";

export interface CreateProjectProps {
  onSuccess?: () => void;
}

export default function CreateProject({ onSuccess }: CreateProjectProps) {
  const { mutate, error } = trpc.project.create.useMutation({ onSuccess });

  const form = useForm({
    initialValues: {
      name: "",
      datasetId: "",
      revisionId: "",
    },
    validate: zodResolver(createProjectSchema),
  });

  return (
    <>
      {error && <ErrorMessage />}
      <form onSubmit={form.onSubmit((values) => mutate(values))} noValidate>
        <TextInput label="Name" {...form.getInputProps("name")} />
        <TextInput label="Dataset ID" {...form.getInputProps("datasetId")} />
        <TextInput label="Revision ID" {...form.getInputProps("revisionId")} />
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
}
