import Discord from "discord.js"
import { happy, angry } from "../../src/modules/reply.js"

export default {
	"name": "debug",
	"description": "Command for various debugging purposes.",
	
	"usage": "debug (option)",
	"permissions": ["ROOT"],
	"options": [{
		name: "option",
		description: "Debug option",
		type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND
	}],

	execute: function(interaction) {
		console.log(interaction.SUB_COMMAND)
	}
}