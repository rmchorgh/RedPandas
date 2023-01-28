import * as Ably from "ably";
import { useEffect } from "react";
import { trpc } from "./trpc";

const client = new Ably.Realtime.Promise(process.env.NEXT_PUBLIC_ABLY_KEY);

export function useAbly(projectId: string, encKey?: string) {
  const utils = trpc.useContext();

  useEffect(() => {
    if (encKey) {
      const channel = client.channels.get(projectId, {
        cipher: { key: encKey },
      });
      channel.subscribe(() => {
        utils.project.invalidate();
      });
      return () => channel.unsubscribe();
    }
  }, [encKey, projectId, utils.project]);
}
