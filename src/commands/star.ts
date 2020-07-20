import { commandInt } from "../interfaces/commandInt";
import { MessageEmbed } from "discord.js";

export const star: commandInt = {
  //prefix and description - prefix is necessary to trigger command, description is for the record.
  prefix: "star",
  description:
    "Gives the mentioned user a gold star! Use the format 'star <user> <reason>'",
  command: function star(message) {
    const target = message.mentions.members?.first();
    if (!target) {
      message.channel.send("ERROR 400: User not provided.");
      return "failed";
    }
    const auth = message.author;
    const starEmbed = new MessageEmbed()
      .setColor("")
      .setTitle("You got a gold star!")
      .setDescription(`<@!${auth}> has given this shiny gold star to you~!`)
      .setImage(
        "https://github.com/nhcarrigan/discord-bot/blob/master/img/star.png?raw=true"
      )
      .setFooter("BEEP BOOP: Feelings of pride detected. 🙃");
    const args = message.content.split(" ");
    const reason = args.slice(2, args.length);
    let reasonMessage = reason.join(" ");
    if (!reasonMessage) {
      reasonMessage = "ERROR 404: Reason not found.";
    }
    starEmbed.addFields({
      name: "Reason",
      value: reasonMessage,
    });
    if (message.mentions.users.first() == message.author) {
      message.channel.send("ERROR 400: Cannot target self.");
      return "failed";
    }
    target.send(starEmbed);
    message.channel.send(`BEEP BOOP: Sent <@!${target}> a gold star!`);
    return "success";
  },
};
