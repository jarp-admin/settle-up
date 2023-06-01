import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  ApplicationCommandOptionType as optType,
} from "discord.js";
import { v4 as uuid } from "uuid";
import { Option } from "./options";
import {
  button,
  command,
  commandMeta,
  handlerOf,
  messageResponse,
} from "./types";

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

    let raw_response = await handler(i.user, args);
    let response: InteractionReplyOptions = {};

    let map: Record<string, (i: ButtonInteraction<CacheType>) => void> = {};

    if (typeof raw_response === "string") response = { content: raw_response };
    else response = makeResponse(raw_response, map);

    let msg = await i.reply(response);

    if (Object.keys(map)) {
      msg.createMessageComponentCollector().on("collect", (i) => {
        let cb = map[i.customId];
        if (!cb) return;
        cb(i as ButtonInteraction<CacheType>);
      });
    }
  };

function makeResponse(
  res: messageResponse,
  map: Record<string, (i: ButtonInteraction<CacheType>) => void>
): InteractionReplyOptions {
  let components: ActionRowBuilder<ButtonBuilder>[] = [];

  if (res.buttons)
    components = [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        res.buttons.map((e) => makeButton(e, map))
      ),
    ];

  return {
    content: res.body,
    ephemeral: res.ephemeral ?? false,
    components: components,
  };
}

function makeButton(
  data: button,
  map: Record<string, (i: ButtonInteraction<CacheType>) => void>
): ButtonBuilder {
  let id = uuid();
  map[id] = data.onClick;
  let btn = new ButtonBuilder().setStyle(data.style).setCustomId(id);

  if (data.label) btn.setLabel(data.label);
  if (data.disabled) btn.setDisabled(data.disabled);
  if (data.url) btn.setURL(data.url);

  return btn;
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
