import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import { defaultServer } from "../../config/database/defaultServer";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { sendWelcomeEmbed } from "../../modules/guild/sendWelcomeEmbed";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Handles the memberUpdate event. Currently checks to see if
 * member has passed screening event, and if so, sends welcome embed.
 * @param {BeccaInt} Becca Becca's client instance
 * @param {GuildMember} oldMember The member's state before the update
 * @param {GuildMember} newMember The member's state after the update
 */
export const memberUpdate = async (
  Becca: BeccaInt,
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
): Promise<void> => {
  try {
    const { guild, user } = newMember;

    // passes membership screening
    if (oldMember.pending && !newMember.pending) {
      const serverSettings = await getSettings(Becca, guild.id, guild.name);
      const welcomeText = (
        serverSettings?.custom_welcome || defaultServer.custom_welcome
      )
        .replace(/{@username}/gi, user.username)
        .replace(/{@servername}/gi, guild.name);

      const welcomeEmbed = new MessageEmbed();
      welcomeEmbed.setColor(Becca.colours.default);
      welcomeEmbed.setTitle("A new adventurer has joined our guild.");
      welcomeEmbed.setDescription(welcomeText);
      welcomeEmbed.setAuthor(
        `${user.username}#${user.discriminator}`,
        user.displayAvatarURL()
      );
      welcomeEmbed.setFooter(`ID: ${user.id}`);
      welcomeEmbed.setTimestamp();

      await sendWelcomeEmbed(Becca, guild, welcomeEmbed);

      if (serverSettings?.join_role) {
        const joinRole = await guild.roles.fetch(serverSettings.join_role);
        if (joinRole) {
          await newMember.roles.add(joinRole);
        }
      }
    }
  } catch (err) {
    beccaErrorHandler(Becca, "member remove event", err, newMember.guild.name);
  }
};
