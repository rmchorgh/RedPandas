import { NextApiRequest, NextApiResponse } from "next";
import { projects } from "../../lib/server/models";
import { ObjectId } from "mongodb";
import { publish } from "../../lib/server/ably";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body: {
    input: string;
    output: string;
    revisionId: string;
    projectId: string;
  } = req.body;
  const project = await (
    await projects
  ).findOneAndUpdate(
    { _id: new ObjectId(body.projectId) },
    {
      $set: { runningCommandInput: null, revisionId: body.revisionId },
      $push: {
        commands: {
          input: body.input,
          output: body.output,
          revisionId: body.revisionId,
        },
      },
    }
  );
  if (project.value) await publish(body.projectId, project.value?.encKey);
  res.status(204).end();
}
