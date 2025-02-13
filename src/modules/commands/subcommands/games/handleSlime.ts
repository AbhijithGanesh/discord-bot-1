import { GuildMember } from "discord.js";
import { slimeList } from "../../../../config/commands/slimeList";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

export const handleSlime: CommandHandler = async (Becca, interaction) => {
  try {
    const member = interaction.member as GuildMember;

    if (!member) {
      await interaction.editReply(Becca.responses.missing_guild);
      return;
    }

    const index = Math.floor(Math.random() * slimeList.length);
    const noun = slimeList[index];

    await member
      .setNickname(`${noun}slime`)
      .then(async () => await interaction.editReply("You've been slimed!"))
      .catch(
        async () =>
          await interaction.editReply(
            "I lack the permission to bequeath you a new name."
          )
      );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "slime command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "slime", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "slime", errorId)],
        })
      );
  }
};
