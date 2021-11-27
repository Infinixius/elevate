import fetch from "node-fetch"
import Discord from "discord.js"
import config from "../../config.json"
import { angry, footer } from "../../src/modules/reply.js"
import { error } from "../../src/modules/logger.js"

export default {
	"name": "e621",
	"description": "Gets a random image with search tags from the e621.net imageboard.",
	"nsfw": true,
	
	"usage": "e621 {list of comma-separated tags}",
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
		var url = `https://e621.net/posts.json?limit=100&tags=${tags}`
		
		fetch(url, { headers: { "User-Agent": config.HTTPuserAgent } })
			.then(res => res.json())
			.then(json => {
				if (json.posts.length == 0) {
					return interaction.editReply(angry("No posts were found.", interaction))
				}
				var post = json.posts.random()
				return interaction.editReply(`${post.file.url} - \`https://e621.net/posts/${post.id}\``)
			})
			.catch(err => {
				error(`Failed to make request to "${url}" Error: "${err}"`)
				return interaction.editReply(angry("Failed to make request to E621! Error: ```" + err + "```", interaction))
			})
	}
}