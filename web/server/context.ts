import { inferAsyncReturnType } from "@trpc/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";

export async function createContext(
  opts: NodeHTTPCreateContextFnOptions<any, any>
) {
  const { userId } = getAuth(opts.req as NextRequest);
  const user = userId ? await clerkClient.users.getUser(userId) : null;
  return { user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
