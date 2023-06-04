import {
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  AnySelectMenuInteraction,
  Attachment,
  ButtonInteraction,
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
import { Option } from "./options";
import { responseMessage } from "./response";

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

export interface commandMeta<T extends Record<string, Option>> {
  name: string;
  description: string;
  options: T;
}

export type argsFor<T extends Record<string, Option>> = {
  [arg in keyof T]: T[arg]["required"] extends true
    ? getArgType<T[arg]["type"]>
    : getArgType<T[arg]["type"]> | undefined;
};

export type handlerOf<T extends Record<string, Option>> = (
  caller: User,
  args: argsFor<T>
) => string | responseMessage | Promise<string | responseMessage>;

// note: a generic handler wraps a handlerOf<T> -
// i.e. destructures args and implements return to reply
export type genericHandler = (
  i: ChatInputCommandInteraction<CacheType>
) => void | Promise<void>;

export interface command {
  meta: commandMeta<Record<string, Option>>;
  handler: genericHandler;
}

type optionalAsyncResponse =
  | responseMessage
  | void
  | Promise<responseMessage | void>;

export type buttonHandler = (
  i: ButtonInteraction<CacheType>
) => optionalAsyncResponse;

export type selectHandler = (
  i: AnySelectMenuInteraction
) => optionalAsyncResponse;

export type componentHandler = buttonHandler | selectHandler;
