import { commandInt } from "../interfaces/commandInt";
import { evaluate } from "mathjs";
import { MessageEmbed } from "discord.js";
import { solveEquation } from "mathsteps";
export const maths: commandInt = {
  prefix: "math",
  description:
    "Performs the **function** on the **problem** - will either calculate an expression, or solve an equation.",
  parameters:
    "`<function>` - calculate, to evaluate an expression; solve, to solve an equation | `<problem>` - expression or equation to process",
  command: function (message) {
    try {
      const args = message.content.split(" ");
      const type = args[1];
      const expression = args.slice(2).join(" ");
      if (type === "calculate") {
        const answer = evaluate(expression);
        if (!answer || !expression) {
          message.channel.send("ERROR 400: Invalid expression.");
          return;
        }
        const mathEmbed = new MessageEmbed()
          .setTitle("Calculation Protocol")
          .setColor("#ab47e6")
          .setDescription("BEEP BOOP: Calculation complete.")
          .addFields(
            { name: "Input", value: expression },
            { name: "Result", value: answer }
          );
        message.channel.send(mathEmbed);
        return;
      }
      if (type === "solve") {
        const solved = solveEquation(expression);
        if (!solved.length) {
          message.channel.send("ERROR 400: Invalid equation.");
          return;
        }
        solved.forEach((step: any, index: number) => {
          const solveEmbed = new MessageEmbed()
            .setTitle(`Step ${index + 1}`)
            .addFields(
              { name: "Before this step", value: step.oldEquation.ascii() },
              { name: "This Step", value: step.changeType },
              { name: "After this step", value: step.newEquation.ascii() }
            );
          message.channel.send(solveEmbed);
        });
        return;
      }
      message.channel.send("ERROR 400: Invalid syntax.");
    } catch (error) {
      message.channel.send("ERROR 400: Invalid request.");
    }
  },
};
