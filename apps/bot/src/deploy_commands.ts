import "dotenv/config";

import env from "env";
import { commands } from "./command_registry";
import deploy from "./lib/deploy";

deploy(commands.collection, {
  token: env.DISCORD_CLIENT_TOKEN,
  client_id: env.DISCORD_CLIENT_ID,
});
