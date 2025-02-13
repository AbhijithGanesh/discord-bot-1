import { MessageEmbed } from "discord.js";
import ActivityModel from "../database/models/ActivityModel";
import { ContextInt } from "../interfaces/contexts/ContextInt";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const activity: ContextInt = {
  data: {
    name: "activity",
    type: 2,
  },
  run: async (Becca, interaction) => {
    try {
      await interaction.deferReply();
      const target = interaction.options.getUser("user");

      if (!target) {
        await interaction.editReply(Becca.responses.missing_param);
        return;
      }

      const data = await ActivityModel.findOne({ userId: target.id });
      if (!data) {
        await interaction.editReply(
          "That user has not interacted with me yet..."
        );
        return;
      }

      const activityEmbed = new MessageEmbed();
      activityEmbed.setTitle("Becca Interactions");
      activityEmbed.addField("Button Clicks", data.buttons.toString(), true);
      activityEmbed.addField("Command Uses", data.commands.toString(), true);
      activityEmbed.addField(
        "Select Menu Selections",
        data.selects.toString(),
        true
      );
      activityEmbed.addField(
        "Context Menu Choices",
        data.contexts.toString(),
        true
      );
      activityEmbed.setColor(Becca.colours.default);
      activityEmbed.setAuthor(target.tag, target.displayAvatarURL());

      await interaction.editReply({ embeds: [activityEmbed] });
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "community group command",
        err,
        interaction.guild?.name
      );
      await interaction
        .reply({
          embeds: [errorEmbedGenerator(Becca, "community group", errorId)],
          ephemeral: true,
        })
        .catch(async () =>
          interaction.editReply({
            embeds: [errorEmbedGenerator(Becca, "community group", errorId)],
          })
        );
    }
  },
};
