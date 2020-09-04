import config from "../../config.json";
import { CommandInt } from "../interfaces/CommandInt";
import { MessageEmbed, TextChannel } from "discord.js";
export const unrestrict: CommandInt = {
  prefix: "unrestrict",
  description:
    "Restore **user**'s access to the channel. Optionally provide a **reason**. Only available to server moderators. Bot will log this action if log channel is available.",
  parameters:
    "`<user>`: @name of the user to restore | `<?reason>`: reason for restoring the user.",
  command: (message) => {
    if (!message.member?.hasPermission("KICK_MEMBERS")) {
      message.channel.send(
        "Sorry, but this command is restricted to moderators."
      );
      return;
    }
    const mod = message.author;
    const cmdArguments = message.content.split(" ");
    const member = message.mentions.members?.first();
    const user = message.mentions.users.first();
    if (!member) {
      message.channel.send(
        "Sorry, but that appears to be an invalid user mention."
      );
      return;
    }
    if (user === mod) {
      message.channel.send("Sorry, but you cannot unrestrict yourself!");
      return;
    }
    const reasonArg = cmdArguments.slice(2, cmdArguments.length);
    let reason = reasonArg.join(" ");
    if (!reason) {
      reason = "Sorry, but the moderator did not provide a reason.";
    }
    const suspend = message.guild?.roles.cache.find(
      (role) => role.name === config.silence_role
    );
    if (!suspend) {
      message.channel.send("Sorry, but I could not find your restricted role.");
      return;
    }
    const unrestrictEmbed = new MessageEmbed()
      .setColor("#00FF00")
      .setTitle("Access Restored")
      .addFields(
        {
          name: "Event:",
          value: `<@!${mod}> has restored <@!${user}>'s access to the server.`,
        },
        {
          name: "Reason:",
          value: `${reason}`,
        }
      )
      .setFooter("Please remember to follow our rules!");
    const modChannel = message.guild?.channels.cache.find(
      (channel) => channel.name === config.log_channel
    ) as TextChannel;
    if (modChannel) {
      modChannel.send(unrestrictEmbed);
    }
    if (!modChannel) {
      message.channel.send(
        "Sorry, but I could not find where you wanted the logs."
      );
    }
    member.roles.remove(suspend).catch((err) => console.log(err));
  },
};
