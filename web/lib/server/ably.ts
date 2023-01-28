import * as Ably from "ably";

const client = new Ably.Rest.Promise(process.env.ABLY_KEY);

export async function publish(projectId: string, encKey: string) {
  const channel = client.channels.get(projectId, {
    cipher: { key: encKey },
  });
  await channel.publish("invalidate", {});
}
