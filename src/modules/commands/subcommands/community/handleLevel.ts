import { MessageEmbed } from "discord.js";
import LevelModel from "../../../../database/models/LevelModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleLevel: CommandHandler = async (Becca, interaction) => {
  try {
    const { guildId, guild, user } = interaction;

    if (!guildId || !guild) {
      await interaction.editReply({
        content: Becca.responses.missing_guild,
      });
      return;
    }
    const serverLevels = await LevelModel.findOne({
      serverID: guildId,
    });

    if (!serverLevels) {
      await interaction.editReply({
        content: "It would appear that rankings are not enabled here.",
      });
      return;
    }

    const target = interaction.options.getUser("user-level") || user;

    const targetLevel = serverLevels.users.find((u) => u.userID === target.id);

    if (!targetLevel) {
      await interaction.editReply({
        content: `<@!${target.id}> has not earned any levels yet...`,
      });
      return;
    }

    const levelEmbed = new MessageEmbed();
    levelEmbed.setColor(Becca.colours.default);
    levelEmbed.setTitle(`${targetLevel.userName}'s ranking`);
    levelEmbed.setDescription(`Here is the record I have in \`${guild.name}\``);
    levelEmbed.addField(
      "Experience Points",
      targetLevel.points.toString(),
      true
    );
    levelEmbed.addField("Level", targetLevel.level.toString(), true);
    levelEmbed.addField(
      "Last Seen",
      `${new Date(targetLevel.lastSeen).toLocaleDateString()}`
    );
    levelEmbed.setTimestamp();
    await interaction.editReply({ embeds: [levelEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "level command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "level", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "level", errorId)],
        })
      );
  }
};
