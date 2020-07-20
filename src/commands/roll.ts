import { commandInt } from "../interfaces/commandInt";

export const roll: commandInt = {
  //prefix and description - prefix is necessary to trigger command, description is for the record.
  prefix: "roll",
  description: "Rolls a random die for you. Use the format 'roll d<number>'.",
  command: function (message) {
    const cmdarguments = message.content.split(" ");
    if (cmdarguments.length < 2 || cmdarguments[1].length < 2) {
      message.channel.send(`ERROR 404: Missing dice argument.`);
      return "failed";
    }
    const dice: Array<string> = cmdarguments[1].split("");
    //argument needs to start with "d"
    if (dice[0] !== "d") {
      message.channel.send(`ERROR 404: Invalid argument syntax.`);
      return "failed";
    }
    dice.splice(0, 1);
    const dievalue: string = dice.join("");
    const random = parseInt(dievalue);
    //if d is not followed by number, this avoids the error.
    if (isNaN(random)) {
      message.channel.send(`ERROR 400: "${dievalue}" is not a valid number.`);
      return "failed";
    }
    const result = Math.floor(Math.random() * random + 1);
    message.channel.send(
      `BEEP BOOP: You rolled a ${dievalue}-sided die and got: ${result}!`
    );
    return "failed";
  },
};
