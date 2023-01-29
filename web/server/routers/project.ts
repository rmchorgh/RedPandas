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
        datasetIds: [input.datasetId],
        revision: -1,
        commands: [],
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
      ).findOne<Pick<WithId<Project>, "userId">>(
        { _id: new ObjectId(input.projectId) },
        { projection: { userId: 1 } }
      );
      if (project?.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await (await projects).updateOne({ _id: new ObjectId(inpu) });
    }),
  getDataset: protectedProcedure
    .input(z.object({ projectId: objectIdSchema }))
    .query(async ({ input, ctx }) => {
      const project = await (
        await projects
      ).findOne<Pick<WithId<Project>, "datasetId" | "revisionId" | "userId">>(
        { _id: new ObjectId(input.projectId) },
        { projection: { datasetId: 1, revisionId: 1, userId: 1 } }
      );
      if (project?.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const resp = await fetch(
        `http://localhost:8000/preview?userId=${ctx.user.id}&datasetId=${project.datasetId}&revisionId=${project.revisionId}`
      );
      const [columns, ...rows]: string[][] = await resp.json();
      return { columns, rows };
    }),
  getCommands: protectedProcedure
    .input(z.object({ projectId: objectIdSchema }))
    .query(async ({ input, ctx }) => {
      const project = await (
        await projects
      ).findOne<
        Pick<
          WithId<Project>,
          "commands" | "runningCommandInput" | "encKey" | "userId"
        >
      >(
        { _id: new ObjectId(input.projectId) },
        {
          projection: {
            commands: 1,
            runningCommandInput: 1,
            encKey: 1,
            userId: 1,
          },
        }
      );
      if (project?.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return project;
    }),
  setRevision: protectedProcedure
    .input(
      z.object({
        projectId: objectIdSchema,
        revisionId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await (
        await projects
      ).findOne<Pick<WithId<Project>, "userId">>(
        { _id: new ObjectId(input.projectId) },
        { projection: { userId: 1 } }
      );
      if (project?.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await (
        await projects
      ).updateOne(
        { _id: new ObjectId(input.projectId) },
        { $set: { revisionId: input.revisionId } }
      );
    }),
  runCommand: protectedProcedure
    .input(
      z.object({
        projectId: objectIdSchema,
        input: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await (
        await projects
      ).findOne<Pick<WithId<Project>, "userId" | "datasetId" | "revisionId">>(
        { _id: new ObjectId(input.projectId) },
        { projection: { userId: 1, datasetId: 1, revisionId: 1 } }
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

      await fetch(
        `http://localhost:8000/run-command?userId=${ctx.user.id}&datasetId=${project.datasetId}&revisionId=${project.revisionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: ctx.user.id,
            datasetId: project.datasetId,
            revisionId: project.revisionId,
            projectId: input.projectId,
            input: input.input,
          }),
        }
      );
    }),
});
