import { neutral } from "../../src/modules/reply.js"

export default {
	"name": "ping",
	"description": "Ping! Returns the current API ping of the bot.",
	
	"usage": "ping",

	execute: function(interaction) {
		var desc = `**Message latency**: \`${Date.now() - interaction.createdTimestamp}ms\`\n`
			.replace("-", "")
		
		desc += `**Websocket latency**: \`${interaction.client.ws.ping}ms\`\n`

		return interaction.reply("Pinging...").then(() => {
			interaction.fetchReply().then(sent => {
				desc += `**Roundtrip latency**: \`${sent.createdTimestamp - interaction.createdTimestamp}ms\``
				sent.edit(neutral(desc, interaction))
			})
		})
	}
}