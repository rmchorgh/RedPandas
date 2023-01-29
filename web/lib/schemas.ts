import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const createProjectSchema = z.object({
  name: z.string().min(1),
  datasetId: z.string().uuid(),
});

export const addDatasetSchema = z.object({
  projectId: objectIdSchema,
  datasetId: z.string().uuid(),
});
