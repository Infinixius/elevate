import Discord from "discord.js"
import fetch from "node-fetch"
import { error } from "../../src/modules/logger.js"
import { angry } from "../../src/modules/reply.js"

export default {
	"name": "fakeperson",
	"description": "Returns an image from thispersondoesnotexist.com",
	
	"usage": "fakeperson",
	"cooldown": 5,
	execute: function(interaction) {
		interaction.deferReply()
		fetch("https://thispersondoesnotexist.com/image")
			.then(res => res.buffer())
			.then(buffer => {
				return interaction.editReply({
					files: [new Discord.MessageAttachment(buffer, "fakeperson.png")]
				})
			})
			.catch(err => {
				error("Failed to fetch! Error: " + err)
				return interaction.reply(angry("Failed to make request! Error: " + err), interaction)
			})
	}
}