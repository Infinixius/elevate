import Discord from "discord.js"
import { happy, angry } from "../../src/modules/reply.js"

export default {
	"name": "kill",
	"description": "Shuts down the bot.",
	
	"usage": "kill",
	"permissions": ["ROOT"],

	execute: async function(interaction) {
		await interaction.reply("👍")
		await interaction.client.user.setPresence({ status: "invisible" })
		await interaction.client.destroy()
		process.exit()
	}
}