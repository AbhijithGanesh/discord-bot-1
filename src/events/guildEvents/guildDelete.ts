import { Guild, MessageEmbed } from "discord.js";
//import LevelModel from "../../database/models/LevelModel";
//import ServerModel from "../../database/models/ServerModel";
//import StarModel from "../../database/models/StarModel";
//import WarningModel from "../../database/models/WarningModel";
import { BeccaInt } from "../../interfaces/BeccaInt";

/**
 * Sends a notification to the debug hook when Becca leaves a server. Also cleans up
 * the stored data for that server.
 * @param Becca Becca's Client instance.
 * @param guild The guild object representing the server Becca was removed from.
 */
export const guildDelete = async (
  Becca: BeccaInt,
  guild: Guild
): Promise<void> => {
  const owner = await guild.members.fetch(guild.ownerId);
  const guildDeleteEmbed = new MessageEmbed();
  guildDeleteEmbed.setTitle(
    `${Becca.user?.username || "Becca Lyria"} has been dismissed from a guild!`
  );
  guildDeleteEmbed.setDescription(
    "It would seem they no longer need my assistance."
  );
  guildDeleteEmbed.addField("Guild Name", guild.name, true);
  guildDeleteEmbed.addField(
    "Guild Owner",
    owner?.user.username || "No owner data available.",
    true
  );
  guildDeleteEmbed.addField("Guild ID", guild.id, true);
  guildDeleteEmbed.addField(
    "Guild Owner ID",
    owner?.id || "No owner data available",
    true
  );
  guildDeleteEmbed.setColor(Becca.colours.warning);
  guildDeleteEmbed.setTimestamp();

  await Becca.debugHook.send({ embeds: [guildDeleteEmbed] });

  /**
   * Clean up the server data.
   */

  /**
   * TODO: Turn back on later. These are temporarily disabled to allow folks to reinvite the bot with correct scopes.
  await ServerModel.findOneAndDelete({ serverID: guild.id });
  await LevelModel.findOneAndDelete({ serverID: guild.id });
  await StarModel.findOneAndDelete({ serverID: guild.id });
  await WarningModel.findOneAndDelete({ serverID: guild.id });
  **/
};
