import { MessageEmbed } from "discord.js";
import { defaultServer } from "../config/database/defaultServer";
import { ListenerInt } from "../interfaces/listeners/ListenerInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const linksListener: ListenerInt = {
  name: "links",
  description: "Listens for links in messages where they are not allowed.",
  run: async (Becca, message, config) => {
    try {
      if (
        !config.anti_links.includes(message.channel.id) &&
        !config.anti_links.includes("all")
      ) {
        return;
      }

      if (config.permit_links.includes(message.channel.id)) {
        return;
      }

      if (message.member?.permissions.has("MANAGE_MESSAGES")) {
        return;
      }

      let blockedLinks = 0;
      let allowedLinks = 0;

      if (config.allowed_links.length) {
        for (const str of config.allowed_links) {
          const regex = new RegExp(str, "ig");
          allowedLinks += (message.content.match(regex) || []).length;
        }
      }

      if (config.link_roles.length) {
        for (const role of config.link_roles) {
          if (message.member?.roles.cache.find((r) => r.id === role)) {
            return;
          }
        }
      }

      const linkRegex =
        /(^|\s+)(([a-z]+:\/\/)?(([a-z0-9-]+\.)+((?!txt|json|css|jsx)[a-z]{3,4}|io|me|gg|to|uk|be|in|eu|ru|us|za)))(:[0-9]{1,5})?(.*\s+|\/|$)/gi;

      blockedLinks += (message.content.match(linkRegex) || []).length;

      if (blockedLinks > 0 && blockedLinks !== allowedLinks) {
        message.deletable && (await message.delete());
        const linkEmbed = new MessageEmbed();
        linkEmbed.setTitle("Invalid Link Detected!");
        linkEmbed.setDescription(
          (config.link_message || defaultServer.link_message).replace(
            /\{@username\}/g,
            `<@!${message.author.id}>`
          )
        );
        linkEmbed.setColor(Becca.colours.error);
        linkEmbed.setAuthor(
          `${message.author.username}#${message.author.discriminator}`,
          message.author.displayAvatarURL()
        );
        await message.channel.send({ embeds: [linkEmbed] });
      }
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "links listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
