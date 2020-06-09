const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  //prefix and description - prefix is necessary to trigger command, description ensures it shows in |help.
  prefix: "pokenum",
  description:
    "Look up a Pokemon! Use the format 'pokenum <number>', or use 'pokenum random' to get a random Pokemon!",
  command: async function(message) {
    const arguments = message.content.split(" ");
    let number = parseInt(arguments[1]);
    if (arguments[1].toLowerCase() == "random") {
      number = Math.floor(Math.random() * 802);
    }
    //PokeAPI only has 802 right now. Check this to avoid null objects.
    if (number < 0 || number > 802) {
      message.channel.send(
        `I apologise, ${message.author}, but I can only access information for Pokemon from number 0 to 802.`
      );
      return;
    }
    //if the argument is not a number, don't call the API.
    if (isNaN(number)) {
      message.channel.send(
        `I apologise, ${message.author}, but I can only search for Pokemon by number. Please try again.`
      );
      return;
    }
    //missingno easter egg
    if (number == 0) {
      const pokemonEmbed = new Discord.MessageEmbed()
        .setColor("#ab47e6")
        .setTitle("Missingno")
        .setDescription("???")
        .setImage("https://aldelaro5.files.wordpress.com/2016/04/657.png")
        .setFooter("Data not found.");
      message.channel.send(pokemonEmbed);
      return;
    }
    //call the API and send the data.
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
    const pokemon = await data.json();
    const pokemonEmbed = new Discord.MessageEmbed()
      .setColor("#ab47e6")
      .setTitle(`${pokemon.name}`)
      .setDescription(`#${pokemon.id}`)
      .setImage(`${pokemon.sprites.front_default}`)
      .setFooter("Brought to you by the Pokemon API.");
    message.channel.send(pokemonEmbed);
  }
};
