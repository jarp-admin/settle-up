import { Prisma } from "database";
import { TRPCError } from "../trpc";

const handlePrismaError = (prismaError: Error) => {
  if (prismaError instanceof Prisma.PrismaClientKnownRequestError) {
    if (prismaError.code === "P2025") {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "An account, corresponding to the discordId provided, was not found",
      });
    } else {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "There was a problem with your request. Please try again.",
      });
    }
  } else {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while fetching the user data.",
    });
  }
};

export default handlePrismaError;
