import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
