import { protectedProcedure, router } from "../trpc";
import { Project, projects } from "../../lib/server/models";
import { ObjectId, WithId } from "mongodb";
import { z } from "zod";
import { createProjectSchema, objectIdSchema } from "../../lib/schemas";
import { TRPCError } from "@trpc/server";
import * as crypto from "node:crypto";

export const projectRouter = router({
  list: protectedProcedure.query(async () => {
    return await (await projects)
      .find()
      .project<Pick<WithId<Project>, "_id" | "name">>({ _id: 1, name: 1 })
      .toArray();
  }),
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input }) => {
      await (
        await projects
      ).insertOne({
        name: input.name,
        datasetId: input.datasetId,
        revisionId: input.revisionId,
        commands: [],
        runningCommandInput: null,
        encKey: crypto.randomBytes(32).toString("base64"),
      });
    }),
  getDataset: protectedProcedure
    .input(z.object({ projectId: objectIdSchema }))
    .query(async ({ input }) => {
      const project = await (
        await projects
      ).findOne<Pick<WithId<Project>, "datasetId" | "revisionId">>(
        { _id: new ObjectId(input.projectId) },
        { projection: { datasetId: 1, revisionId: 1 } }
      );
      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // TODO call orchestrator
      return {
        columns: ["revision id", "b", "c"],
        rows: [
          [project.revisionId, "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          ["10", "11", "12"],
          ["13", "14", "15"],
          ["16", "17", "18"],
          ["19", "20", "21"],
          ["22", "23", "24"],
          ["25", "26", "27"],
          ["28", "29", "30"],
          ["31", "32", "33"],
        ],
      };
    }),
  getCommands: protectedProcedure
    .input(z.object({ projectId: objectIdSchema }))
    .query(async ({ input }) => {
      const project = await (
        await projects
      ).findOne<
        Pick<WithId<Project>, "commands" | "runningCommandInput" | "encKey">
      >(
        { _id: new ObjectId(input.projectId) },
        { projection: { commands: 1, runningCommandInput: 1, encKey: 1 } }
      );
      if (!project) {
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
    .mutation(async ({ input }) => {
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
    .mutation(async ({ input }) => {
      // TODO call orchestrator
      setTimeout(() => {
        fetch(
          `${
            process.env.VERCEL_URL || "http://localhost:3000"
          }/api/orchestrator-hook`,
          {
            method: "POST",
            body: JSON.stringify({
              input: input.input,
              output: "Some output here",
              revisionId: crypto.randomUUID(),
              projectId: input.projectId,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
      }, 3000);

      await (
        await projects
      ).updateOne(
        { _id: new ObjectId(input.projectId) },
        { $set: { runningCommandInput: input.input } }
      );
    }),
});
