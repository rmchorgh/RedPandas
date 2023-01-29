import { trpc } from "../../lib/client/trpc";
import ErrorMessage from "../ErrorMessage";
import RunCommand from "./RunCommand";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faUndo, faBolt } from "@fortawesome/free-solid-svg-icons";

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
  const { mutate: callGPT, error: callGPTError } =
    trpc.project.chatGPT.useMutation({});

  const scrollingRef = useRef<HTMLDivElement>(null);
  const [gpt, setGpt] = useState(false);

  useEffect(() => {
    if (scrollingRef.current)
      scrollingRef.current.scrollTop = scrollingRef.current.scrollHeight;
  }, [commands, runningCommandInput]);

  return (
    <div className="flex h-full flex-col justify-end">
      <div className="overflow-auto" ref={scrollingRef}>
        {commands.map(
          (command, i) =>
            command.input && (
              <div
                key={i}
                className="mb-4 rounded-2xl border border-gray-200 bg-gray-100 text-sm"
              >
                <pre className="border-b border-gray-200 px-3 py-2 font-bold">
                  <code className="language-python">{command.input}</code>
                </pre>
                {command.output && (
                  <pre className="px-3 py-2">
                    <code>{command.output}</code>
                  </pre>
                )}
              </div>
            )
        )}
        {runningCommandInput && (
          <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-100 text-sm">
            <pre className="border-b border-gray-200 px-3 py-2 font-bold">
              <code className="language-python">{runningCommandInput}</code>
            </pre>
            <div className="flex flex-row px-3 py-2">
              <p className={"animate-bounce delay-75"}>.</p>
              <p className={"animate-bounce delay-100"}>.</p>
              <p className={"animate-bounce delay-75"}>.</p>
            </div>
          </div>
        )}
      </div>

      <RunCommand
        projectId={projectId}
        onSuccess={() => utils.project.get.invalidate()}
        gpt={gpt}
        setGpt={setGpt}
      />

      <div className="flex items-center justify-end">
        <button
          onClick={() => undo({ projectId })}
          className="mr-2 rounded-md bg-gray-300  px-3 py-2 text-black"
        >
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button
          onClick={() => redo({ projectId })}
          className="rounded-md bg-gray-300  px-3 py-2 text-black"
        >
          <FontAwesomeIcon icon={faRedo} />
        </button>
        <button
          onClick={() => setGpt((gpt) => !gpt)}
          className={"ml-2  rounded-md bg-gray-300 py-2 px-4 text-sm font-bold"}
        >
          AI Assistant{" "}
          <FontAwesomeIcon
            icon={faBolt}
            size={"xl"}
            className={"animate-pulse"}
          />
        </button>
      </div>
      {(undoError || redoError) && <ErrorMessage />}
    </div>
  );
}
