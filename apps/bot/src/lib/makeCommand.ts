import {
  CacheType,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType as optType,
} from "discord.js";
import { Option } from "./options";
import { command, commandMeta, handlerOf } from "./types";

const makeCommand = <T extends Record<string, Option>>(
  meta: commandMeta<T>,
  handler: handlerOf<T>
) => {
  return { meta, handler: destructureArgs(meta, handler) } as command;
};

type destructureArgs = <T extends Record<string, Option>>(
  meta: commandMeta<T>,
  handler: handlerOf<T>
) => handlerOf<T>;

const destructureArgs: destructureArgs = (meta, handler) => async (i, _) => {
  type handlerArgType = Parameters<typeof handler>[1];

  let args = Object.entries(meta.options).reduce(
    (acc, [optionName, option]) => {
      let value = argGetter[option.type](i, optionName) ?? undefined;

      return {
        ...acc,
        [optionName]: value,
      };
    },
    {} as handlerArgType
  );

  return await handler(i, args);
};

type i = ChatInputCommandInteraction<CacheType>;

let argGetter = {
  [optType.Boolean]: (i: i, argName: string) => i.options.getBoolean(argName),
  [optType.String]: (i: i, argName: string) => i.options.getString(argName),
  [optType.Integer]: (i: i, argName: string) => i.options.getInteger(argName),
  [optType.Number]: (i: i, argName: string) => i.options.getNumber(argName),
  [optType.User]: (i: i, argName: string) => i.options.getUser(argName),
  [optType.Role]: (i: i, argName: string) => i.options.getRole(argName),
  [optType.Channel]: (i: i, argName: string) => i.options.getChannel(argName),
  [optType.Mentionable]: (i: i, argName: string) =>
    i.options.getMentionable(argName),
  [optType.Attachment]: (i: i, argName: string) =>
    i.options.getAttachment(argName),
};

export default makeCommand;
