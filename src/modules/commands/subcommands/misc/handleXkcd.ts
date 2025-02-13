import axios from "axios";
import { MessageEmbed } from "discord.js";
import { XkcdInt } from "../../../../interfaces/commands/general/XkcdInt";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleXkcd: CommandHandler = async (Becca, interaction) => {
  try {
    const number = interaction.options.getInteger("number");
    let url = "https://xkcd.com/";
    if (number) {
      url += `${number}/`;
    }
    url += "info.0.json";

    const xkcd = await axios.get<XkcdInt>(url);

    const xkcdEmbed = new MessageEmbed();
    xkcdEmbed.setTitle(xkcd.data.title);
    xkcdEmbed.setURL(xkcd.data.link || "https://xkcd.com");
    xkcdEmbed.setImage(xkcd.data.img);
    xkcdEmbed.setDescription(xkcd.data.alt);
    xkcdEmbed.setFooter(`XKCD comic ${xkcd.data.num}`);
    xkcdEmbed.setColor(Becca.colours.default);
    xkcdEmbed.setTimestamp();

    await interaction.editReply({ embeds: [xkcdEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "xkcd command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "xkcd", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "xkcd", errorId)],
        })
      );
  }
};
