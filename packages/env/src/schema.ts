import { z } from "zod";

const required = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  // this can be generated with:
  //? $ openssl rand -base64 32
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url(),

  // database:
  POSTGRES_URL: z.string().nonempty(),
  POSTGRES_PRISMA_URL: z.string().nonempty(),
  POSTGRES_URL_NON_POOLING: z.string().nonempty(),
  POSTGRES_USER: z.string().nonempty(),
  POSTGRES_HOST: z.string().nonempty(),
  POSTGRES_PASSWORD: z.string().nonempty(),
  POSTGRES_DATABASE: z.string().nonempty(),

  // for tRPC router
  API_HOST: z.string().nonempty(),
  API_PORT: z.coerce.number(),

  // for discord
  DISCORD_CLIENT_ID: z.string().nonempty(),
  DISCORD_CLIENT_TOKEN: z.string().nonempty(),
  DISCORD_CLIENT_SECRET: z.string().nonempty(),
});

export default required;
export type Schema = z.infer<typeof required>;
