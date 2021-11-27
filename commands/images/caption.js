import Discord from "discord.js"
import { URL } from "url"
import { download, caption } from "../../src/modules/images.js"
import { angry } from "../../src/modules/reply.js"
import { error } from "../../src/modules/logger.js"

var cacheNum = 0

export default {
	"name": "caption",
	"description": "Adds an esmbot-style caption to an image.",
	
	"usage": "gay (user mention)",
	"options": [{
		name: "image",
		description: "Image URL.",
		required: true,
		type: Discord.Constants.ApplicationCommandOptionTypes.STRING
	},{
		name: "caption",
		description: "Caption text. Must be under 512 characters.",
		required: true,
		type: Discord.Constants.ApplicationCommandOptionTypes.STRING
	}],

	execute: async function(interaction) {
		await interaction.deferReply()

		try {
			var parsedURL = new URL(interaction.options.getString("image"))
			if (!parsedURL.host.endsWith("discordapp.com") && !parsedURL.host.endsWith("discordapp.net")) throw "Not a Discord host! Please only use photos uploaded directly to Discord."
			if (!parsedURL.pathname.endsWith(".png") && !parsedURL.pathname.endsWith(".jpg") && !parsedURL.pathname.endsWith(".jpeg")) throw "Invalid filetype! Must be a PNG/JPG/JPEG!"
		} catch (err) {
			error(`Failed to parse url! URL: "${interaction.options.getString("image")}" Error: "${err}"`)
			return interaction.editReply(angry("Unable to parse URL! Please make sure you provide an actual Discord image. Error: ```" + err + "```", interaction))
		}
		
		var fileType = parsedURL.pathname.split(".")[parsedURL.pathname.split(".").length - 1]
		cacheNum++
		var path = `./cache/caption${cacheNum}.${fileType}`
		var image = await download(parsedURL.href, path)
			.catch(err => {
				error(`Failed to download image! Error: "${err}" URL: "${parsedURL.href}" Path: "${path}"`)
			})
		
		var captionedImage = await caption(path, interaction.options.getString("caption"))
			.catch(err => {
				interaction.editReply(angry("An internal error occured while processing that image!", interaction))
				return error("Imagemagick processing failed! Error: " + err)
			})
		return interaction.editReply({
			files: [new Discord.MessageAttachment(captionedImage, "caption." + fileType)]
		}).catch(err => {
			interaction.editReply(angry("An internal error occured while sending that image!", interaction))
			return error("Discord failed to send image! Error: " + err)
		})
	}
}