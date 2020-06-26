const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");
const prefix = config.prefix;
const dotenv = require("dotenv");
const mongodb = require("mongodb");
const Mongoose = require("mongoose");
dotenv.config({ path: __dirname + "/../.env" });
client.login(process.env.DISCORD_TOKEN).catch((e) => console.error(e));

//command files here:
const ping = require("./ping.js");
const kick = require("./kick.js");
const help = require("./help.js");
const fortune = require("./fortune.js");
const warn = require("./warn.js");
const restrict = require("./restrict.js");
const unrestrict = require("./unrestrict.js");
const pokenum = require("./pokenum.js");
const status = require("./status.js");
const ban = require("./ban.js");
const roll = require("./roll.js");
const purge = require("./purge.js");
const about = require("./about.js");
const wiki = require("./wiki.js");
const pokename = require("./pokename.js");
const search = require("./search.js");
const profile = require("./profile.js");
const kirby = require("./kirby.js");
const magic = require("./magic.js");
const star = require("./star.js");
const user = require("./user.js");
const levels = require("./levels.js");
const cat = require("./cat.js");
const close = require("./close.js");
const usage = require("./usage.js");
//command names in this array
const commands = [
  kick,
  ping,
  help,
  fortune,
  warn,
  restrict,
  unrestrict,
  pokenum,
  status,
  ban,
  roll,
  purge,
  about,
  wiki,
  pokename,
  search,
  profile,
  kirby,
  magic,
  star,
  user,
  levels,
  cat,
  close,
  usage,
];

//verify bot is ready
client.on("ready", function () {
  const initChannel = client.channels.cache.find(
    (channel) => channel.name == config.join_leave_channel
  );
  const initEmbed = new Discord.MessageEmbed()
    .setTitle("Activate the Omega")
    .setDescription(
      "I am the Alpha and the Omega,\n The First and the Last,\n The Beginning and the End."
    )
    .setColor("#ab47e6");
  if (initChannel) {
    initChannel.send(initEmbed).catch((e) => console.error(e));
    return;
  }
  console.log("Activate the Omega");
  return;
});

//db connection
Mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch((err) => initChannel.send("Database connection failed."));

//welcome message
client.on("guildMemberAdd", function (member) {
  const welcomeEmbed = new Discord.MessageEmbed()
    .setColor("#00ff00")
    .setTitle("Welcome!")
    .setDescription("BEEP BOOP: Gratitude for joining my server.")
    .addFields(
      {
        name: "Rules:",
        value: "Please read the rules in our Welcome channel!",
      },
      {
        name: "My Commands:",
        value: `Use the ${prefix} prefix to get my attention! Try '${prefix}help' to see what I can do!`,
      }
    )
    .setFooter("BEEP BOOP: Have fun!");
  member.send(welcomeEmbed).catch((e) => console.error(e));
  const welcomeLogEmbed = new Discord.MessageEmbed()
    .setColor("#ab47e6")
    .setTitle("A new user has joined! 🙃")
    .setDescription(
      `BEEP BOOP: New member detected. Initiate welcome protocol for ${member.user}!`
    );
  const welcomeChannel = member.guild.channels.cache.find(
    (channel) => channel.name == config.join_leave_channel
  );
  if (!welcomeChannel) {
    console.error("welcome channel not found.");
    return;
  } else {
    welcomeChannel.send(welcomeLogEmbed).catch((e) => console.error(e));
  }
});

//depart message
client.on("guildMemberRemove", function (member) {
  const goodbyeChannel = member.guild.channels.cache.find(
    (channel) => channel.name == config.join_leave_channel
  );
  const departEmbed = new Discord.MessageEmbed()
    .setColor("#ab47e6")
    .setTitle("A user has left us! 😦")
    .setDescription(
      `BEEP BOOP: User departure detected. Initiate goodbye protocol for ${member.user}! You will be missed!`
    );
  if (!goodbyeChannel) {
    console.error("depart channel not found.");
    return;
  } else {
    goodbyeChannel.send(departEmbed).catch((e) => console.error(e));
  }
});

//messages listener
client.on("message", function (message) {
  levels.listener(message);
  if (message.attachments.array().length > 0) {
    if (!message.attachments.array()[0].height) {
      message.delete();
      message.channel.send("ERROR 415: Only images and videos supported.");
    }
  }
  for (let command of commands) {
    if (message.content.startsWith(prefix + command.prefix)) {
      usage.listener(message);
      command.command(message);
      break;
    }
  }
});

//deleted message logging
client.on("messageDelete", function (message) {
  const logChannel = message.guild.channels.cache.find(
    (channel) => channel.name == config.log_channel
  );
  const deleteEmbed = new Discord.MessageEmbed()
    .setTitle("A message was deleted.")
    .setColor("#ff0000")
    .setDescription("BEEP BOOP: Loading message details.")
    .addFields(
      {
        name: "Message author:",
        value: message.author,
      },
      {
        name: "Channel:",
        value: message.channel,
      },
      {
        name: "Content:",
        value: message.content,
      }
    );
  if (!logChannel) {
    console.error("logging channel not found");
    message.channel.send(deleteEmbed);
    return;
  } else {
    logChannel.send(deleteEmbed);
  }
});
