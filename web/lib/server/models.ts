import { MongoClient } from "mongodb";

export const clientPromise = new MongoClient(process.env.MONGODB_URI).connect();

export interface Project {
  datasetId: string;
  revisionId: string;
  name: string;
  commands: {
    input: string;
    output: string;
    revisionId: string;
  }[];
  runningCommandInput: string | null;
  encKey: string;
}

export const projects = clientPromise.then((client) =>
  client.db("redpandas").collection<Project>("projects")
);
