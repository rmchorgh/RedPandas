import { MongoClient } from "mongodb";

export const clientPromise = new MongoClient(process.env.MONGODB_URI).connect();

export interface CommandsType {
  input: string;
  output: string;
  plots: string[];
  datasets: {
    id: string;
    revision: number;
    name: string;
  }[];
}

export interface Project {
  userId: string;
  name: string;
  commands: CommandsType[];
  runningCommandInput: string | null;
  revision: number;
  encKey: string;
}

export const projects = clientPromise.then((client) =>
  client.db("redpandas").collection<Project>("projects")
);
