import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType as optType,
} from "discord.js";

import { Option } from "./options";
import { responseMessage } from "./response";
import { command, commandMeta, handlerOf } from "./types";

const makeCommand = <T extends Record<string, Option>>(
  meta: commandMeta<T>,
  handler: handlerOf<T>
) => {
  return { meta, handler: wrapper(meta, handler) } as command;
};

const wrapper =
  <T extends Record<string, Option>>(
    meta: commandMeta<T>,
    handler: handlerOf<T>
  ) =>
  async (i: ChatInputCommandInteraction<CacheType>) => {
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

    let res = wrapString(await handler(i.user, args));
    reply(i, res);
  };

type replyable =
  | ChatInputCommandInteraction<CacheType>
  | AnySelectMenuInteraction<CacheType>
  | ButtonInteraction<CacheType>;

async function reply(i: replyable, [text, map]: responseMessage) {
  let msg = await i.reply(text);

  if (Object.keys(map)) {
    msg.createMessageComponentCollector().on("collect", async (i) => {
      if (i.isAnySelectMenu()) {
        i.values;
      }
      let cb = map[i.customId];
      if (!cb) return;

      // if this goes wrong, the world is ending
      // but also, any casting is evil
      // maybe try to remove?
      let response = await cb(i as any);
      if (response) await reply(i, wrapString(response));
    });
  }
}

function wrapString(res: string | responseMessage): responseMessage {
  return typeof res === "string" ? [{ content: res }, {}] : res;
}

let argGetter = {
  [optType.Boolean]: (
    i: ChatInputCommandInteraction<CacheType>,
    argName: string
  ) => i.options.getBoolean(argName),
  [optType.String]: (
    i: ChatInputCommandInteraction<CacheType>,
    argName: string
  ) => i.options.getString(argName),
  [optType.Integer]: (
    i: ChatInputCommandInteraction<CacheType>,
    argName: string
  ) => i.options.getInteger(argName),
  [optType.Number]: (
    i: ChatInputCommandInteraction<CacheType>,
    argName: string
  ) => i.options.getNumber(argName),
  [optType.User]: (
    i: ChatInputCommandInteraction<CacheType>,
    argName: string
  ) => i.options.getUser(argName),
  [optType.Role]: (
    i: ChatInputCommandInteraction<CacheType>,
    argName: string
  ) => i.options.getRole(argName),
  [optType.Channel]: (
    i: ChatInputCommandInteraction<CacheType>,
    argName: string
  ) => i.options.getChannel(argName),
  [optType.Mentionable]: (
    i: ChatInputCommandInteraction<CacheType>,
    argName: string
  ) => i.options.getMentionable(argName),
  [optType.Attachment]: (
    i: ChatInputCommandInteraction<CacheType>,
    argName: string
  ) => i.options.getAttachment(argName),
};

export default makeCommand;
