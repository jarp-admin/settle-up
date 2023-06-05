import { Prisma } from "database";
import { TRPCError } from "../trpc";

const prismaErrorHandler = (prismaError: Error) => {
  if (prismaError instanceof Prisma.PrismaClientKnownRequestError) {
    if (prismaError.code === "P2025") {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Could not find the necessary fields to complete this request",
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
      message:
        "An error occurred while processing the request. Please try again later.",
    });
  }
};
export default prismaErrorHandler;
