import { Message } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { heartsListener } from "../../listeners/heartsListener";
import { levelListener } from "../../listeners/levelListener";
import { linksListener } from "../../listeners/linksListener";
import { thanksListener } from "../../listeners/thanksListener";
import { handleDms } from "../../modules/handleDms";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { registerCommands } from "../../utils/registerCommands";

/**
 * Handles the onMessage event. Validates that the message did not come from
 * another bot, then passes the message through to the listeners and command handler.
 * @param Becca Becca's Client instance
 * @param message The message object received by the gateway event
 */
export const messageCreate = async (
  Becca: BeccaInt,
  message: Message
): Promise<void> => {
  try {
    const { author, channel, guild } = message;

    if (author.bot) {
      return;
    }

    if (!guild || channel.type === "DM") {
      await handleDms(Becca, message);
      return;
    }

    const serverConfig = await getSettings(Becca, guild.id, guild.name);

    if (!serverConfig) {
      throw new Error("Could not get server configuration.");
    }

    await heartsListener.run(Becca, message, serverConfig);
    await thanksListener.run(Becca, message, serverConfig);
    await linksListener.run(Becca, message, serverConfig);
    await levelListener.run(Becca, message, serverConfig);

    if (
      message.author.id === Becca.configs.ownerId &&
      message.content === "emergency reload"
    ) {
      await registerCommands(Becca);
      await message.reply("Reloaded all commands.");
    }
  } catch (err) {
    beccaErrorHandler(
      Becca,
      "message send event",
      err,
      message.guild?.name,
      message
    );
  }
};
