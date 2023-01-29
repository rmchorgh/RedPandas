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
import { Configuration, OpenAIApi } from "openai";

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
            plots: [],
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
  chatGPT: protectedProcedure
    .input(
      z.object({
        input: z.string().min(1),
        projectId: objectIdSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const project = await (
        await projects
      ).findOne<Pick<WithId<Project>, "userId" | "revision" | "commands">>(
        { _id: new ObjectId(input.projectId) },
        { projection: { userId: 1, revision: 1, commands: 1 } }
      );
      if (project?.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const resp = await fetch(
        `http://localhost:8000/preview?userId=${ctx.user.id}&datasetId=${
          project.commands[project.revision].datasets[0].id
        }&revision=${project.commands[project.revision].datasets[0].revision}`
      );
      const [columns]: string[][] = await resp.json();

      const response = await openai.createCompletion({
        model: "code-davinci-002",
        prompt: `You are a large language model getting instructions on how to write Python code. The user giving you instructions has a dataframe with ${
          columns.length
        } columns. The names of the columns are ${columns.join(
          ","
        )}. You are asked to ${
          input.input
        }. Respond only in runnable code and nothing else.`,
        temperature: 0,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
      });
      return response.data.choices;
    }),
});
