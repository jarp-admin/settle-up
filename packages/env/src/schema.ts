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
  DATABASE_URL: z.string().url().nonempty(),

  // for tRPC router
  API_HOST: z.string().nonempty(),
  API_PORT: z.number(),

  // for discord
  DISCORD_DEV_GUILD_ID: z.string().nonempty(),
  DISCORD_CLIENT_ID: z.string().nonempty(),
  DISCORD_CLIENT_TOKEN: z.string().nonempty(),
  DISCORD_CLIENT_SECRET: z.string().nonempty(),
});

export default required;
export type Schema = z.infer<typeof required>;
