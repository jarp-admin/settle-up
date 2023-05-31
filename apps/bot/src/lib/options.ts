import {
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType as optType,
} from "discord.js";

type optionBase = { required?: boolean; description: string };

export let StringOption = <
  T extends optionBase &
    (
      | {
          max_length?: number;
          min_length?: number;
          choices?: APIApplicationCommandOptionChoice<string>[];
          autocomplete?: false;
        }
      | {
          max_length?: number;
          min_length?: number;
          autocomplete: true;
        }
    )
>(
  args: T
) => {
  return { ...args, type: optType.String as const };
};

export let NumberOption = <
  T extends optionBase &
    (
      | {
          max?: number;
          min?: number;
          choices?: APIApplicationCommandOptionChoice<number>[];
          autocomplete?: false;
        }
      | {
          max?: number;
          min?: number;
          autocomplete: true;
        }
    )
>(
  args: T
) => {
  return { ...args, type: optType.Number as const };
};

export let IntegerOption = <
  T extends optionBase &
    (
      | {
          max?: number;
          min?: number;
          choices?: APIApplicationCommandOptionChoice<number>[];
          autocomplete?: false;
        }
      | {
          max?: number;
          min?: number;
          autocomplete: true;
        }
    )
>(
  args: T
) => {
  return { ...args, type: optType.Integer as const };
};

// boilerplate options:
export let BooleanOption = <T extends optionBase>(args: T) => {
  return { ...args, type: optType.Boolean as const };
};

export let UserOption = <T extends optionBase>(args: T) => {
  return { ...args, type: optType.User as const };
};

export let RoleOption = <T extends optionBase>(args: T) => {
  return { ...args, type: optType.Role as const };
};

export let MentionableOption = <T extends optionBase>(args: T) => {
  return { ...args, type: optType.Mentionable as const };
};

export let ChannelOption = <T extends optionBase>(args: T) => {
  return { ...args, type: optType.Channel as const };
};

export let AttachmentOption = <T extends optionBase>(args: T) => {
  return { ...args, type: optType.Attachment as const };
};

export type Option =
  | ReturnType<typeof StringOption>
  | ReturnType<typeof NumberOption>
  | ReturnType<typeof IntegerOption>
  | ReturnType<typeof BooleanOption>
  | ReturnType<typeof UserOption>
  | ReturnType<typeof RoleOption>
  | ReturnType<typeof MentionableOption>
  | ReturnType<typeof ChannelOption>
  | ReturnType<typeof AttachmentOption>;
