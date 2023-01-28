import {
  Button,
  Flex,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { trpc } from "../../lib/client/trpc";
import ErrorMessage from "../ErrorMessage";
import { createProjectSchema } from "../../lib/schemas";
import { useForm, zodResolver } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import { useColorScheme } from "@mantine/hooks";
import { useState } from "react";

export interface CreateProjectProps {
  onSuccess?: () => void;
}

export default function CreateProject({ onSuccess }: CreateProjectProps) {
  const colorScheme = useColorScheme();
  const { mutate, error } = trpc.project.create.useMutation({ onSuccess });
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      datasetId: "",
      revisionId: "",
    },
    validate: zodResolver(createProjectSchema),
  });

  return (
    <Paper shadow="xs" p="md" h={150} onClick={() => setOpened(true)}>
      <Stack
        h="100%"
        align="center"
        c={{ light: "gray.9", dark: "white" }[colorScheme]}
      >
        <IconPlus size={64} />
        <Text>New Project</Text>
      </Stack>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="New Project"
      >
        {error && <ErrorMessage />}
        <form onSubmit={form.onSubmit((values) => mutate(values))} noValidate>
          <TextInput label="Name" {...form.getInputProps("name")} mb="md" />
          <TextInput
            label="Dataset ID"
            {...form.getInputProps("datasetId")}
            mb="md"
          />
          <TextInput
            label="Revision ID"
            {...form.getInputProps("revisionId")}
            mb="md"
          />
          <Button type="submit">Create Project</Button>
        </form>
      </Modal>
    </Paper>
  );
}
