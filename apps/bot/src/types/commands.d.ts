import {
  APIApplicationCommandOptionChoice,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  Attachment,
  CacheType,
  CategoryChannel,
  ChatInputCommandInteraction,
  ForumChannel,
  GuildMember,
  NewsChannel,
  PrivateThreadChannel,
  PublicThreadChannel,
  Role,
  StageChannel,
  TextChannel,
  User,
  VoiceChannel,
  ApplicationCommandOptionType as optTypes,
} from "discord.js";

type optionBase = { required?: boolean; description: string };

type stringOption = optionBase & {
  type: optTypes.String;
  max_length?: number;
  min_length?: number;
} & (
    | {
        choices?: APIApplicationCommandOptionChoice<string>[];
        autocomplete?: false;
      }
    | { autocomplete: true }
  );

type numberOption = optionBase & {
  type: optTypes.Number;
  min?: number;
  max?: number;
} & (
    | {
        choices?: APIApplicationCommandOptionChoice<number>[];
        autocomplete?: false;
      }
    | { autocomplete: true }
  );

type integerOption = optionBase & {
  type: optTypes.Integer;
  min?: number;
  max?: number;
} & (
    | {
        choices?: APIApplicationCommandOptionChoice<number>[];
        autocomplete?: false;
      }
    | { autocomplete: true }
  );

type booleanOption = optionBase & { type: optTypes.Boolean };

type userOption = optionBase & { type: optTypes.User };
type roleOption = optionBase & { type: optTypes.Role };
type mentionableOption = optionBase & { type: optTypes.Mentionable };
type channelOption = optionBase & { type: optTypes.Channel };

type attachmentOption = optionBase & { type: optTypes.Attachment };

type option =
  | stringOption
  | numberOption
  | integerOption
  | booleanOption
  | userOption
  | roleOption
  | mentionableOption
  | channelOption
  | attachmentOption;

type getArgType<T> = T extends optTypes.String
  ? string
  : T extends optTypes.Number
  ? number
  : T extends optTypes.Integer
  ? number
  : T extends optTypes.Boolean
  ? boolean
  : T extends optTypes.User
  ? User
  : T extends optTypes.Role
  ? Role | APIRole
  : T extends optTypes.Mentionable
  ? User | GuildMember | APIInteractionDataResolvedGuildMember | Role | APIRole
  : T extends optTypes.Channel
  ?
      | CategoryChannel
      | NewsChannel
      | StageChannel
      | TextChannel
      | PrivateThreadChannel
      | PublicThreadChannel<boolean>
      | VoiceChannel
      | ForumChannel
      | APIInteractionDataResolvedChannel
  : T extends optTypes.Attachment
  ? Attachment
  : never;

//*   actual interesting types:
export interface commandMeta<T extends Record<string, option>> {
  name: string;
  description: string;
  options: T;
}

export type argsFor<T extends Record<string, option>> = {
  [arg in keyof T]: T[arg]["required"] extends true
    ? getArgType<T[arg]["type"]>
    : getArgType<T[arg]["type"]> | undefined;
};

export type handlerOf<T extends Record<string, option>> = (
  i: ChatInputCommandInteraction<CacheType>,
  args: argsFor<T>
) => void | Promise<void>;

export interface command {
  meta: commandMeta<Record<string, option>>;
  handler: handlerOf<Record<string, option>>;
}
