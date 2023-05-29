import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/v10";
import {
  APIApplicationCommandOption,
  CacheType,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType as optTypes,
} from "discord.js";
import { command, commandMeta, handlerOf, option } from "./types";

export const toJSON = ({
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

export const makeCommand = <T extends Record<string, option>>(
  meta: commandMeta<T>,
  handler: handlerOf<T>
) => {
  return { meta, handler: destructureArgs(meta, handler) } as command;
};

type destructureArgs = <T extends Record<string, option>>(
  meta: commandMeta<T>,
  handler: handlerOf<T>
) => handlerOf<T>;

export const destructureArgs: destructureArgs =
  (meta, handler) => async (i, _) => {
    let args = Object.keys(meta.options).reduce((acc, optionName) => {
      let value = getArg(i, optionName, meta.options[optionName]!);
      // todo handle bad args here
      // i.e. what if its required and not present?

      return {
        ...acc,
        [optionName]: value,
      };
    }, {});

    return await handler(i, args as any);
  };

const getArg = (
  i: ChatInputCommandInteraction<CacheType>,
  argName: string,
  data: option
) => {
  switch (data.type) {
    case optTypes.Boolean:
      return i.options.getBoolean(argName);
    case optTypes.String:
      return i.options.getString(argName);
    case optTypes.Integer:
      return i.options.getInteger(argName);
    case optTypes.Number:
      return i.options.getNumber(argName);
    case optTypes.User:
      return i.options.getUser(argName);
    case optTypes.Role:
      return i.options.getRole(argName);
    case optTypes.Mentionable:
      return i.options.getMentionable(argName);
    case optTypes.Channel:
      return i.options.getChannel(argName);
    case optTypes.Attachment:
      return i.options.getAttachment(argName);
  }
};
