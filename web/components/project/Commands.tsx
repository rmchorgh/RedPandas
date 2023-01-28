import { trpc } from "../../lib/client/trpc";
import Loading from "../Loading";
import ErrorMessage from "../ErrorMessage";
import { Box, Button, Code } from "@mantine/core";
import { useAbly } from "../../lib/client/ably";
import RunCommand from "./RunCommand";

export interface CommandsProps {
  projectId: string;
}

export default function Commands({ projectId }: CommandsProps) {
  const { data, error, refetch } = trpc.project.getCommands.useQuery({
    projectId,
  });
  const { mutate, error: mutateError } = trpc.project.setRevision.useMutation({
    onSuccess: () => utils.project.getDataset.invalidate(),
  });
  const utils = trpc.useContext();

  useAbly(projectId, data?.encKey);

  if (error) return <ErrorMessage />;
  if (!data) return <Loading />;

  return (
    <>
      {data.commands.map((command) => (
        <Box key={command.revisionId}>
          <Box>
            <Code>{command.input}</Code>
          </Box>
          <Code>{command.output}</Code>
          {mutateError && <ErrorMessage />}
          <Button
            onClick={() =>
              mutate({ revisionId: command.revisionId, projectId })
            }
          >
            Revert to here
          </Button>
        </Box>
      ))}
      {data.runningCommandInput && <Code>{data.runningCommandInput}</Code>}
      <RunCommand projectId={projectId} onSuccess={() => refetch()} />
    </>
  );
}
