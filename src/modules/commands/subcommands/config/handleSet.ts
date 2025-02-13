import { MessageEmbed } from "discord.js";
import { SettingsTypes } from "../../../../interfaces/settings/SettingsTypes";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { renderSetting } from "../../../commands/config/renderSetting";
import { validateSetting } from "../../../commands/config/validateSetting";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { setSetting } from "../../../settings/setSetting";

export const handleSet: CommandHandler = async (Becca, interaction, config) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({ content: Becca.responses.missing_guild });
      return;
    }

    const setting = interaction.options.getString("setting");
    const value = interaction.options.getString("value");
    if (!value) {
      await interaction.editReply(
        "Not sure how, but you managed to forget the value!"
      );
      return;
    }

    const isValid = await validateSetting(
      Becca,
      setting as SettingsTypes,
      value,
      guild,
      config
    );
    if (!isValid) {
      await interaction.editReply(
        `${value} is not a valid option for ${setting}.`
      );
      return;
    }

    const isSet = await setSetting(
      Becca,
      guild.id,
      guild.name,
      setting as SettingsTypes,
      value,
      config
    );

    if (!isSet) {
      await interaction.editReply(
        "I am having trouble updating your settings. Please try again later."
      );
      return;
    }
    const newContent = isSet[setting as SettingsTypes];
    const parsedContent = Array.isArray(newContent)
      ? newContent
          .map((el) => renderSetting(Becca, setting as SettingsTypes, el))
          .join(", ")
      : renderSetting(Becca, setting as SettingsTypes, newContent);
    const successEmbed = new MessageEmbed();
    successEmbed.setTitle(`${setting} Updated`);
    successEmbed.setDescription(customSubstring(parsedContent, 2000));
    successEmbed.setTimestamp();
    successEmbed.setColor(Becca.colours.default);
    await interaction.editReply({ embeds: [successEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "set command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "set", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "set", errorId)],
        })
      );
  }
};
