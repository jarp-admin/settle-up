import { v4 as uuid } from "uuid";

import {
  APIActionRowComponent,
  APIEmbed,
  APIMessageActionRowComponent,
  ChannelType,
  InteractionReplyOptions,
} from "discord.js";
import { buttonHandler, componentHandler } from "./types";

type handlerMap = Record<string, componentHandler>;

export type responseMessage = [InteractionReplyOptions, handlerMap];

type messageFactory = (
  text: string,
  objs?: {
    embeds?: APIEmbed[];
    components?: {
      row1?: messageComponent[];
      row2?: messageComponent[];
      row3?: messageComponent[];
      row4?: messageComponent[];
      row5?: messageComponent[];
    };
  }
) => responseMessage;

export let Message: messageFactory = (text, { embeds, components } = {}) => {
  let map: handlerMap = {};

  let res: InteractionReplyOptions = {
    content: text,
  };

  if (components) {
    let rows = makeRows(components, map);
    res.components = rows;
  }

  if (embeds) res.embeds = embeds;

  return [res, map];
};

function makeRows(
  {
    row1,
    row2,
    row3,
    row4,
    row5,
  }: {
    row1?: messageComponent[];
    row2?: messageComponent[];
    row3?: messageComponent[];
    row4?: messageComponent[];
    row5?: messageComponent[];
  },
  map: handlerMap
): APIActionRowComponent<APIMessageActionRowComponent>[] {
  let rows = [row1, row2, row3, row4, row5]
    .filter(Boolean)
    .filter((e) => e.length);

  let res = rows.map((row) => {
    return {
      type: 1 as const,
      components: row.map(
        (component) => component(map) as APIMessageActionRowComponent
      ),
    };
  });

  return res;
}

export let Ephemeral: messageFactory = (text, objs) => {
  let [msg, map] = Message(text, objs);
  msg.ephemeral = true;
  return [msg, map];
};

type buttonType = "primary" | "secondary" | "success" | "danger" | "link";

function toStyle(s: buttonType) {
  return ["primary", "secondary", "success", "danger", "link"].indexOf(s) + 1;
}

export let Button =
  ({
    label,
    style,
    onClick,
  }: {
    label: string;
    style: buttonType;
    onClick: buttonHandler;
  }) =>
  (map: handlerMap) => {
    let id = uuid();
    map[id] = onClick;

    let btn = {
      type: 2, //i.e. button
      style: toStyle(style),
      label: label,
      custom_id: id,
    };

    return btn;
  };

export let LinkButton =
  (args: {
    label: string;
    style: buttonType;
    url: string;
    disabled?: boolean;
  }) =>
  (_map: handlerMap) => {
    let { style, ...rest } = args;
    return {
      type: 2,
      style: toStyle(style),
      ...rest,
    };
  };

export let TextInput =
  (args: {
    handler: componentHandler;
    label: string;
    paragraph?: boolean;
    min_length?: number;
    max_length?: number;
    required?: boolean;
    value?: string;
    placeholder?: string;
  }) =>
  (map: handlerMap) => {
    let { handler, paragraph, ...rest } = args;

    let id = uuid();
    map[id] = handler;

    return {
      ...rest,
      type: 4,
      custom_id: id,
      style: paragraph ? 2 : 1,
    };
  };

interface selectArgs {
  handler: componentHandler;
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  disabled?: boolean;
}

export let StringSelect =
  (
    args: selectArgs & {
      options: {
        label: string;
        value: string;
        description?: string;
        default?: boolean;
      }[];
    }
  ) =>
  (map: handlerMap) => {
    let { handler, ...rest } = args;
    let id = uuid();
    map[id] = handler;

    return { type: 3, custom_id: id, ...rest };
  };

export let ChannelSelect =
  (args: selectArgs & { channel_types: ChannelType }) => (map: handlerMap) => {
    let { handler, ...rest } = args;
    let id = uuid();
    map[id] = handler;

    return { type: 8, custom_id: id, ...rest };
  };

export let UserSelect = (args: selectArgs) => (map: handlerMap) => {
  let { handler, ...rest } = args;
  let id = uuid();
  map[id] = handler;

  return { type: 5, custom_id: id, ...rest };
};

export let RoleSelect = (args: selectArgs) => (map: handlerMap) => {
  let { handler, ...rest } = args;
  let id = uuid();
  map[id] = handler;

  return { type: 6, custom_id: id, ...rest };
};

export let MentionableSelect = (args: selectArgs) => (map: handlerMap) => {
  let { handler, ...rest } = args;
  let id = uuid();
  map[id] = handler;

  return { type: 7, custom_id: id, ...rest };
};

type messageComponent =
  | ReturnType<typeof Button>
  | ReturnType<typeof LinkButton>
  // | ReturnType<typeof TextInput>
  | ReturnType<typeof StringSelect>
  | ReturnType<typeof ChannelSelect>
  | ReturnType<typeof UserSelect>
  | ReturnType<typeof RoleSelect>
  | ReturnType<typeof MentionableSelect>;

export let Embed = (embed: APIEmbed): APIEmbed => embed;
