// i sincerely regret creating this command

const fetch = require("node-fetch")
const config = require("../../config.json")
const response = require("../../modules/Response.js")
const logger = require("../../modules/Logger.js")
const { validate, trims } = require("../../modules/Utility.js")

module.exports = {
	name: "e621",
	description: "Returns an image from e621.net.",
	category: "internet",
	args: true,
	usage: "(tags separated by spaces)",
	nsfw: true,
	cooldown: 5,
	async execute(message, args, context) {
		var tags = message.content
			.trim()
			.slice(message.content.split(" ")[0].length+1)
		let url = "https://e621.net/posts.json?limit=10&tags="+validate(tags).replace("_", "+")
		
		await message.react("👀")
		fetch(url, { headers: { "User-Agent": config.httpUserAgent } })
			.then(res => res.json())
			.then(json => {
				if (json.posts.length == 0) {
					return message.reply(response(message, "reply", "negative", message.author, { title: "No results were found, or some sort of error occured." }))
				}
				let post = json.posts[Math.floor(Math.random() * json.posts.length)]
				let embed = { color: "FFB900", fields: [], image:{} }
				
				embed.footer = {
					"text": `Requested by ${message.author.username}`,
					"icon_url": message.author.avatarURL({ format: "png", size: 256 })
				}
				
				embed.title = "Post #"+post.id+" on e621.net"
				if (post.description) embed.description = post.description
				embed.fields.push({ name: "Artist(s)", value: trims(post.tags.artist.join(", ")) })
				embed.fields.push({ name: "Tag(s)", value: trims(post.tags.general.join(", ")) })
				if (post.tags.character.length > 0) {
					embed.fields.push({ name: "Character(s)", value: post.tags.character.join(", ") })
				}
				embed.image.url = post.file.url
				embed.url = "https://e621.net/posts/"+post.id
				
				if (post.duration != null && post.file.url != null) {
					embed.fields.push({ name: "Video post", value: "Videos currently don't work in embeds, so the video will be available in a reply to this message." })
					message.reply({ embeds: [embed] })
						.then(sent => {
							sent.reply(post.file.url)
						})
				} else if (post.duration != null && !post.file.url) {
					embed.fields.push({ name: "Video unvailable", value: "For some reason, E621 didn't return a video for this post." })
					message.reply({ embeds: [embed] })
				} else {
					message.reply({ embeds: [embed] })
				}
			})
			.catch(error => {
				logger.error("Fetch error: "+error)
				message.reply(response(message, "error", "negative", message.author, { 
					description: "Failed to make HTTP request!",
					error: error
				}))
			})
	}
}