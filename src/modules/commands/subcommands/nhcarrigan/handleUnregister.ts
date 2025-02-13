import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { MessageEmbed } from "discord.js";
import { CommandDataInt } from "../../../../interfaces/commands/CommandDataInt";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

export const handleUnregister: CommandHandler = async (Becca, interaction) => {
  try {
    const target = interaction.options.getString("command");

    if (!target) {
      await interaction.editReply(Becca.responses.missing_param);
      return;
    }

    const targetCommand = Becca.commands.find((el) => el.data.name === target);

    if (!targetCommand) {
      await interaction.editReply("Cannot find that command.");
      return;
    }

    const rest = new REST({ version: "9" }).setToken(Becca.configs.token);

    const commands: CommandDataInt[] = (await rest.get(
      Routes.applicationCommands(Becca.configs.id)
    )) as CommandDataInt[];

    const command = commands.find((el) => el.name === targetCommand.data.name);

    if (!command) {
      await interaction.editReply(
        "That command does not appear to be registered."
      );
      return;
    }

    await rest.delete(
      `${Routes.applicationCommands(Becca.configs.id)}/${command.id}`
    );

    const confirm = new MessageEmbed();
    confirm.setTitle(`${command.name} Command Unregistered`);
    confirm.setDescription(command.description);

    for (const option of command.options) {
      confirm.addField(option.name, option.description, true);
    }

    await interaction.editReply({ embeds: [confirm] });
    await Becca.debugHook.send(
      `Hey <@!${Becca.configs.ownerId}>, the ${command.name} command was unregistered.`
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "list command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "list", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "list", errorId)],
        })
      );
  }
};
