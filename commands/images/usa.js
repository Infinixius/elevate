import Discord from "discord.js"
import { overlay } from "../../src/modules/images.js"
import { angry } from "../../src/modules/reply.js"
import { error } from "../../src/modules/logger.js"

export default {
	"name": "usa",
	"description": "Overlays a U.S.A. flag onto someone's avatar.",
	
	"usage": "usa (user mention)",
	"options": [{
		name: "user",
		description: "User to overlay a flag onto.",
		required: true,
		type: Discord.Constants.ApplicationCommandOptionTypes.USER
	}],

	execute: async function(interaction) {
		await interaction.deferReply()
		let image = await overlay(
			interaction.options.getUser("user").avatarURL({ format: "png", size: 1024 }),
			"./assets/images/usflag.png"
		).catch(err => {
			interaction.editReply(angry("An internal error occured while processing that image!", interaction))
			return error("Imagemagick processing failed! Error: " + err)
		})
		return interaction.editReply({
			files: [new Discord.MessageAttachment(image, "usa.png")]
		}).catch(err => {
			interaction.editReply(angry("An internal error occured while sending that image!", interaction))
			return error("Discord failed to send image! Error: " + err)
		})
		
	}
}