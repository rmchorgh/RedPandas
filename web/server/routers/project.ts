import { protectedProcedure, router } from "../trpc";
import { Project, projects } from "../../lib/server/models";
import { ObjectId, WithId } from "mongodb";
import { z } from "zod";
import {
  addDatasetSchema,
  createProjectSchema,
  objectIdSchema,
} from "../../lib/schemas";
import { TRPCError } from "@trpc/server";
import * as crypto from "node:crypto";

export const projectRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await (await projects)
      .find({ userId: ctx.user.id })
      .project<Pick<WithId<Project>, "_id" | "name">>({ _id: 1, name: 1 })
      .toArray();
  }),
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const response = await (
        await projects
      ).insertOne({
        userId: ctx.user.id,
        name: input.name,
        commands: [
          {
            input: "",
            output: "",
            datasets: [
              {
                id: input.datasetId,
                revision: 0,
                name: "df",
              },
            ],
          },
        ],
        revision: 0,
        runningCommandInput: null,
        encKey: crypto.randomBytes(32).toString("base64"),
      });
      return {
        _id: response.insertedId,
      };
    }),
  addDataset: protectedProcedure
    .input(addDatasetSchema)
    .mutation(async ({ input, ctx }) => {
      const project = await (
        await projects
      ).findOne<Pick<WithId<Project>, "userId" | "revision">>(
        { _id: new ObjectId(input.projectId) },
        { projection: { userId: 1, revision: 1 } }
      );
      if (project?.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // TODO delete forward history
      await (
        await projects
      ).updateOne(
        { _id: new ObjectId(input.projectId) },
        {
          $push: {
            [`commands.${project.revision}.datasets`]: {
              id: input.datasetId,
              revision: 0,
              name: "df" + project.revision,
            },
          },
        }
      );
    }),
  getDataset: protectedProcedure
    .input(
      z.object({ datasetId: z.string().uuid(), revision: z.number().min(0) })
    )
    .query(async ({ input, ctx }) => {
      const resp = await fetch(
        `http://localhost:8000/preview?userId=${ctx.user.id}&datasetId=${input.datasetId}&revision=${input.revision}`
      );
      const [columns, ...rows]: string[][] = await resp.json();
      return { columns, rows };
    }),
  get: protectedProcedure
    .input(z.object({ projectId: objectIdSchema }))
    .query(async ({ input, ctx }) => {
      const project = await (
        await projects
      ).findOne<
        Pick<
          WithId<Project>,
          | "commands"
          | "runningCommandInput"
          | "encKey"
          | "userId"
          | "revision"
          | "name"
        >
      >(
        { _id: new ObjectId(input.projectId) },
        {
          projection: {
            commands: 1,
            runningCommandInput: 1,
            encKey: 1,
            userId: 1,
            revision: 1,
            name: 1,
          },
        }
      );
      if (project?.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return project;
    }),
  undo: protectedProcedure
    .input(
      z.object({
        projectId: objectIdSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await (
        await projects
      ).findOne<Pick<WithId<Project>, "userId" | "revision">>(
        { _id: new ObjectId(input.projectId) },
        { projection: { userId: 1, revision: 1 } }
      );
      if (project?.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (project.revision > 0) {
        await (
          await projects
        ).updateOne(
          { _id: new ObjectId(input.projectId) },
          { $set: { revision: project.revision - 1 } }
        );
      }
    }),
  redo: protectedProcedure
    .input(
      z.object({
        projectId: objectIdSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await (
        await projects
      ).findOne<Pick<WithId<Project>, "userId" | "revision" | "commands">>(
        { _id: new ObjectId(input.projectId) },
        { projection: { userId: 1, revision: 1, commands: 1 } }
      );
      if (project?.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (project.revision < project.commands.length - 1) {
        await (
          await projects
        ).updateOne(
          { _id: new ObjectId(input.projectId) },
          { $set: { revision: project.revision + 1 } }
        );
      }
    }),
  runCommand: protectedProcedure
    .input(
      z.object({
        projectId: objectIdSchema,
        input: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO delete forward history
      const project = await (
        await projects
      ).findOne<Pick<WithId<Project>, "userId" | "commands" | "revision">>(
        { _id: new ObjectId(input.projectId) },
        { projection: { userId: 1, commands: 1, revision: 1 } }
      );
      if (project?.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await (
        await projects
      ).updateOne(
        { _id: new ObjectId(input.projectId) },
        { $set: { runningCommandInput: input.input } }
      );

      await fetch(`http://localhost:8000/run-command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          datasets: project.commands[project.revision].datasets,
          input: input.input,
          userId: ctx.user.id,
          projectId: input.projectId,
        }),
      });
    }),
});
