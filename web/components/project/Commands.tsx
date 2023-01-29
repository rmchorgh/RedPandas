import { trpc } from "../../lib/client/trpc";
import Loading from "../Loading";
import ErrorMessage from "../ErrorMessage";
import { useAbly } from "../../lib/client/ably";
import RunCommand from "./RunCommand";

export interface CommandsProps {
  commands: { input: string; output: string }[];
  runningCommandInput: string | null;
  projectId: string;
}

export default function Commands({
  commands,
  runningCommandInput,
  projectId,
}: CommandsProps) {
  const utils = trpc.useContext();
  const { mutate: undo, error: undoError } = trpc.project.undo.useMutation({
    onSuccess: () => utils.project.get.invalidate(),
  });
  const { mutate: redo, error: redoError } = trpc.project.redo.useMutation({
    onSuccess: () => utils.project.get.invalidate(),
  });

  return (
    <>
      {commands.map((command, i) => (
        <div key={i}>
          <code>{command.input}</code>
          <code>{command.output}</code>
        </div>
      ))}
      {runningCommandInput && <code>{runningCommandInput}</code>}

      {(undoError || redoError) && <ErrorMessage />}
      <button onClick={() => undo({ projectId })}>Undo</button>
      <button onClick={() => redo({ projectId })}>Redo</button>

      <RunCommand
        projectId={projectId}
        onSuccess={() => utils.project.get.invalidate()}
      />
    </>
  );
}
