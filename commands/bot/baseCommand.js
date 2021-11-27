// this is a base command with all the available attributes
// this command will not actually be registered and thus will not be usable in the bot
import Discord from "discord.js"

export default {
	"name": "base",
	"description": "Base command as an example for creating other commands",
	
	"usage": "base",
	"permissions": ["MODERATOR"], // MODERATOR, ADMIN, ROOT, or a user/role ID
	"cooldown": 5,
	"options": [{ // options to be sent to the slash command handler
		name: "code",
		description: "JavaScript code to be evaulated.",
		required: true,
		type: Discord.Constants.ApplicationCommandOptionTypes.STRING
	}],

	execute: function(interaction) {
		
	}
}