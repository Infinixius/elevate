import fetch from "node-fetch"
import Discord from "discord.js"
import { angry, footer } from "../../src/modules/reply.js"
import { error } from "../../src/modules/logger.js"

export default {
	"name": "rule34",
	"description": "Gets a random image with search tags from the Rule34.xxx imageboard.",
	"nsfw": true,
	
	"usage": "r34 {list of comma-separated tags}",
	"options": [{
		name: "tags",
		description: "List of comma-separated tags.",
		required: true,
		type: Discord.Constants.ApplicationCommandOptionTypes.STRING
	}],
	"cooldown": 5,
	execute: async function(interaction) {
		await interaction.deferReply()

		var tags = encodeURIComponent(interaction.options.getString("tags"))
			.trim()
			.replace(/\W ,/g, "")
			.replace("%2C", "+") // %2C is the comma (,) URL-encoded
		var url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=100&tags=${tags}`
		
		fetch(url)
			.then(res => res.json())
			.then(json => {
				if (json.length == 0) {
					return interaction.editReply(angry("No posts were found.", interaction))
				}
				var post = json.random()
				return interaction.editReply(`${post.file_url} - \`https://rule34.xxx/index.php?page=post&s=view&id=${post.id}\``)
			})
			.catch(err => {
				if (err == "SyntaxError: Unexpected end of JSON input") {
					return interaction.editReply(angry("No posts were found.", interaction))
				}
				error(`Failed to make request to "${url}" Error: "${err}"`)
				return interaction.editReply(angry("Failed to make request to Rule34! Error: ```" + err + "```", interaction))
			})
	}
}