import {
  CacheType,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType as optTypes,
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
      let value = getArg(i, optionName, option);

      return {
        ...acc,
        [optionName]: value,
      };
    },
    {} as handlerArgType
  );

  return await handler(i, args);
};

/* TODO clean up getArg
 I know this is ugly
 open to suggestions for fixing it
 maybe something dictionary based?
*/
const getArg = (
  i: ChatInputCommandInteraction<CacheType>,
  argName: string,
  data: Option
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

export default makeCommand;
