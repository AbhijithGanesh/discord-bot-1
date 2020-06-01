const Discord = require("discord.js");

module.exports = {
  //prefix and description - prefix is necessary to trigger command, description ensures it shows in |help.
  prefix: "unrestrict",
  description:
    "Restore a user's permissions. Use the format 'unrestrict <user> <reason>'. Only available to server moderators.",
  command: function(message) {
    //check for appropriate permissions
    if (message.member.hasPermission("KICK_MEMBERS") == false) {
      message.channel.send(
        `I apologise, ${message.author}, but you do not have the correct permissions to use this command.`
      );
      return;
    }
    const mod = message.author;
    const arguments = message.content.split(" ");
    const user = message.mentions.members.first();
    //check for valid user tag
    if (user == undefined) {
      message.channel.send(
        `I apologise, ${mod}, but that appears to be an invalid user tag. Please try again.`
      );
      return;
    }
    //cannot target self
    if (user == mod) {
      message.channel.send(
        `Wait, ${mod}, you cannot punish yourself! Shall I find you some assistance?`
      );
      return;
    }
    const reasonArg = arguments.slice(2, arguments.length);
    let reason = reasonArg.join(" ");
    //check for reason provided, if none then create one.
    if (reason == "") {
      reason = "No reason provided.";
    }
    const suspend = message.guild.roles.cache.find(
      role => role.name == "Restricted"
    );
    // check for valid role. Change role.name to match your server.
    if (!suspend) {
      message.channel.send(
        `I apologise, ${mod}, but it seems the server does not have a "Restricted" role for me to remove.`
      );
      return;
    }
    const unrestrictEmbed = new Discord.MessageEmbed()
      .setColor("#00FF00")
      .setTitle(`Access Restored`)
      .addFields(
        {
          name: "What happened?",
          value: `${mod} has restored ${user}'s access to the server.`
        },
        {
          name: "Reason",
          value: `${reason}`
        }
      )
      .setFooter("Please remember to follow our rules!");
    const modChannel = message.guild.channels.cache.find(
      channel => channel.name === "moderation-activity"
    );
    if (modChannel) {
      modChannel.send(unrestrictEmbed);
    }
    user.roles.remove(suspend).catch(e => console.log(e));
  }
};
