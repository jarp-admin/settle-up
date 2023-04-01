import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  display: publicProcedure.input(z.object({})).query(({ ctx }) => {
    return ctx.prisma.user.findFirst();
  }),
});
