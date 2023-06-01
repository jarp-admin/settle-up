import {
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  Attachment,
  ButtonInteraction,
  ButtonStyle,
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

interface button {
  style: ButtonStyle;
  label?: string;
  url?: string;
  disabled?: boolean;
  onClick: (i: ButtonInteraction<CacheType>) => void | Promise<void>;
}

interface messageResponse {
  body: string;
  buttons?: button[];
  ephemeral?: boolean;
}

export type handlerOf<T extends Record<string, Option>> = (
  caller: User,
  args: argsFor<T>
) => string | messageResponse | Promise<string | messageResponse>;

export type genericHandler = (
  i: ChatInputCommandInteraction<CacheType>
) => void | Promise<void>;

export interface command {
  meta: commandMeta<Record<string, Option>>;
  handler: genericHandler;
}
