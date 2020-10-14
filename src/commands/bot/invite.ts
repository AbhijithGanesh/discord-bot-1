import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const INVITE_CONSTANTS = {
  title: "Bot invitation",
  description: "Thank for your interest in adding this bot to your server, invite the bot to your server by [clicking here](https://discord.com/api/oauth2/authorize?client_id=716707753090875473&permissions=268511254&scope=bot).",
  footer: "I feel so happy! 💜",
}

const invite: CommandInt = {
  name: "invite",
  description: "Get the invitation url of the bot to your server.",
  run: async (message) => {
    const { bot, channel } = message;

    // Send an embed message to the current channel.
    await channel.send(
      new MessageEmbed()
        .setColor(bot.color)
        .setTitle(INVITE_CONSTANTS.title)
        .setDescription(INVITE_CONSTANTS.description)
        .setFooter(INVITE_CONSTANTS.footer)
    );
  },
};

export default invite;
