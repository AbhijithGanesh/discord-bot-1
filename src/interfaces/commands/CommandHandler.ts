import { CommandInteraction } from "discord.js";
import { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../BeccaInt";

export type CommandHandler = (
  Becca: BeccaInt,
  interaction: CommandInteraction,
  config: ServerModelInt
) => Promise<void>;
