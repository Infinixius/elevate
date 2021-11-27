import Discord from "discord.js"
import commands from "../../src/modules/commands.cjs"
import { angry, footer } from "../../src/modules/reply.js"
import pkg from "../../package.json"
const { getList, getCommand } = commands // commands.cjs is a commonjs module, and has to be imported this way

export default {
	"name": "help",
	"description": "Returns a help message with commands and information!",
	
	"usage": "ping",
	"options": [{
		name: "command",
		description: "Command to get help for.",
		required: false,
		type: Discord.Constants.ApplicationCommandOptionTypes.STRING
	}],

	execute: function(interaction) {
		var commandHelp = interaction.options.getString("command")
		if (commandHelp) {
			var command = getCommand(commandHelp)
			if (command) {
				var desc = `
					**Description**: ${command.description}
					**Cooldown**: ${command.cooldown || 3}
					**Usage**: /${command.usage || "/" + command.name}
				`
				return interaction.reply({"content": null, embeds: [{
					"title": command.name,
					"description": desc,
					"color": 0x5af969,
					"footer": footer(interaction)
				}]})
			} else {
				return interaction.reply(angry("That command doesn't exist!", interaction))
			}
		}
		return interaction.reply({"content": null, embeds: [{
			"title": "Elevate v" + pkg.version,
			"description": "Elevate is a multipurpose Discord bot written by infinixius#5875.",
			"color": 0x404bce,
			"fields": [
				{
					"name": "Commands",
					"value": "https://infinixius.github.io/elevate/Commands\n\nAlternatively, you can run `help` with a command to see more information about that command."
				},
				{
					"name": "Commands",
					"value": "```" + getList().join(", ") + "```"
				},
				{
					"name": "Links",
					"value": "[Commands](https://infinixius.github.io/elevate/Commands) - [Credits](https://infinixius.github.io/elevate/Credits) - [GitHub](https://github.com/infinixius/elevate)",
					"inline": true
				}
			],
			"footer": footer(interaction)
		}]})
	}
}