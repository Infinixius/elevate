import Discord from "discord.js"
import { overlay } from "../../src/modules/images.js"

export default {
	"name": "avatar",
	"description": "Gets another user's avatar.",
	
	"usage": "avatar (user mention)",
	"options": [{
		name: "user",
		description: "User to get avatar of.",
		required: true,
		type: Discord.Constants.ApplicationCommandOptionTypes.USER
	}],
	execute: async function(interaction) {
		return interaction.reply(interaction.options.getUser("user").avatarURL({ format: "png", size: 1024 }))
	}
}