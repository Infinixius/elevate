import fs from "fs"
import Discord from "discord.js"
import fetch from "node-fetch"
import { URL } from "url"
import acrcloud from "acrcloud"
import config from "../../config.json"
import { error } from "../../src/modules/logger.js"
import { angry } from "../../src/modules/reply.js"

const ACR = new acrcloud({
	host: config.acr.host,
	access_key: config.acr.access_key,
	access_secret: config.acr.access_secret
})

export default {
	"name": "acr",
	"description": "Trys to find the song in a video using ACRCloud.",
	
	"usage": "acr (video URL)",
	"cooldown": 5,
	"options": [{
		name: "url",
		description: "Discord video URL",
		required: true,
		type: Discord.Constants.ApplicationCommandOptionTypes.STRING
	}],

	execute: async function(interaction) {
		await interaction.deferReply()
		var time = Date.now()

		try {
			var url = new URL(interaction.options.get("url"))
			var path = url.pathname.split("/")
			if (url.host !== "cdn.discordapp.com") throw "Not a cdn.discordapp.com domain!"
		} catch (err) {
			error("Failed to parse URL! Error: " + err)
			return interaction.editReply(angry("Failed to parse URL!", interaction))
		}
		
		var filePath = `./cache/${Math.floor(Math.random() * 999)}-${path[path.length - 1]}`
		var file = fs.createWriteStream(filePath)
		var res = await fetch(url.href)
		await new Promise((resolve, reject) => {
			res.body.pipe(file)
			res.body.on("error", reject)
			file.on("finish", resolve)
		}).catch(err => {
			error("Failed to pipe/download file! Error: " + err)
			return interaction.editReply(angry("Failed to parse URL!"))
		})

		var data = fs.readFileSync(filePath)
		ACR.identify(data)
			.then(meta => {
				if (!meta.metadata) {
					switch (meta.status.code) {
						case 1001:
							interaction.editReply("No song detected!")
							break
						case 2001:
							interaction.editReply("Failed to detect song! Request timed out.")
							break
						case 2005:
							interaction.editReply("Failed to detect song! Failed to parse metadata.")
							break
						case 3000:
							interaction.editReply("Failed to detect song! Internal server error.")
							break
						case 3003:
							interaction.editReply("Failed to detect song! API limit exceeded.")
							break
						default:
							interaction.editReply("Failed to detect song! Unknown error.")
							break
					}
				} else {
					var song = meta.metadata.music[0]

					if (song.external_metadata.youtube !== undefined) {
						interaction.editReply(`https://youtube.com/watch?v=${song.external_metadata.youtube.vid}. Found in ${Date.now() - time}ms!`)
					} else {
						var artists = ""
						for (const artist of song.artists) artists += artist.name + ", "
						interaction.editReply(`${song.title} by ${artists.slice(0, artists.length - 2)}. Unable to find song on YouTube. Found in ${Date.now() - time}ms!`)
					}
				}
			})
	}
}
