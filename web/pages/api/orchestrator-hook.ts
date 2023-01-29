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
    projectId: string;
    plots: string[];
  } = req.body;
  const project = await (
    await projects
  ).findOne({ _id: new ObjectId(body.projectId) });
  if (!project) {
    res.status(404).end();
    return;
  }

  await (
    await projects
  ).updateOne(
    { _id: new ObjectId(body.projectId) },
    {
      $set: {
        runningCommandInput: null,
        [`commands.${project?.revision + 1}`]: {
          input: body.input,
          output: body.output,
          plots: [...project.commands[project.revision].plots, ...body.plots],
          datasets: project.commands[project.revision].datasets.map((x) => ({
            ...x,
            revision: x.revision + 1,
          })),
        } as any, // mongo has broken type defs
      },
      $inc: { revision: 1 },
    }
  );
  await publish(body.projectId, project.encKey);
  res.status(204).end();
}
