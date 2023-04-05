import schema, { Schema } from "./schema";

function check() {
  let varNames = Object.keys(schema.shape);

  const processEnv = varNames.reduce((acc, val) => {
    return { ...acc, [val]: process.env[val] };
  }, {}) as any;

  let publicProcessEnvMask = varNames
    .filter((e) => e.startsWith("NEXT_PUBLIC"))
    .reduce((acc, val) => {
      return { ...acc, [val]: true };
    }, {}) as any;

  let clientSchema = schema.pick(publicProcessEnvMask);

  let env: Schema = process.env as any;

  if (!!process.env.SKIP_ENV_VALIDATION == false) {
    const isServer = typeof window === "undefined";

    const parsed = isServer
      ? schema.safeParse(processEnv) // on server we can validate all env vars
      : clientSchema.safeParse(processEnv); // on client we can only validate the ones that are exposed

    if (parsed.success === false) {
      console.error(
        "Invalid environment variables:",
        parsed.error.flatten().fieldErrors,
        "\n"
      );
      throw new Error("Invalid environment variables");
    }

    env = new Proxy(parsed.data, {
      get(target, prop) {
        if (typeof prop !== "string") return undefined;
        // Throw a descriptive error if a server-side env var is accessed on the client
        // Otherwise it would just be returning `undefined` and be annoying to debug
        if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
          throw new Error(
            process.env.NODE_ENV === "production"
              ? "❌ Attempted to access a server-side environment variable on the client"
              : `❌ Attempted to access server-side environment variable '${prop}' on the client`
          );
        return target[prop as keyof typeof target];
      },
    }) as any;
  }

  return env;
}

export default check;
