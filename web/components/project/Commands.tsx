import { trpc } from "../../lib/client/trpc";
import Loading from "../Loading";
import ErrorMessage from "../ErrorMessage";
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
        <div key={command.revisionId}>
            <code>{command.input}</code>
          <code>{command.output}</code>
          {mutateError && <ErrorMessage />}
          <button
            onClick={() =>
              mutate({ revisionId: command.revisionId, projectId })
            }
          >
            Revert to here
          </button>
        </div>
      ))}
      {data.runningCommandInput && <code>{data.runningCommandInput}</code>}
      <RunCommand projectId={projectId} onSuccess={() => refetch()} />
    </>
  );
}
