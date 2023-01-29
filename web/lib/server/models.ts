import { MongoClient } from "mongodb";

export const clientPromise = new MongoClient(process.env.MONGODB_URI).connect();

export interface Project {
  userId: string;
  name: string;
  commands: {
    input: string;
    output: string;
    datasetIds: string[];
  }[];
  runningCommandInput: string | null;
  commandIndex: number;
  encKey: string;
}

export const projects = clientPromise.then((client) =>
  client.db("redpandas").collection<Project>("projects")
);
