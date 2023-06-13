import {
  APIApplicationCommandOption,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import { command } from "./types";

const toJSON = ({
  meta,
}: command): RESTPostAPIChatInputApplicationCommandsJSONBody => {
  return {
    ...meta,
    options: Object.entries(meta.options).map(([k, v]) => {
      return {
        name: k,
        ...v,
      } satisfies APIApplicationCommandOption;
    }),
  };
};

export default toJSON;
