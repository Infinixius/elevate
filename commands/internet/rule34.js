const fetch = require("node-fetch")
const config = require("../../config.json")
const response = require("../../modules/Response.js")
const logger = require("../../modules/Logger.js")
const { validate, trims } = require("../../modules/Utility.js")

module.exports = {
	name: "rule34",
	description: "Returns an image from rule34.xxx.",
	category: "internet",
	args: true,
	usage: "(tags separated by spaces)",
	nsfw: true,
	cooldown: 5,
	async execute(message, args, context) {
		var tags = message.content
			.trim()
			.slice(message.content.split(" ")[0].length+1)
		let url = "https://"+config.rule34Instance+"/posts?limit=10&tags="+validate(tags).replace("_", "+") // validate replaces spaces with underscores
		
		await message.react("👀")
		fetch(url, { headers: { "User-Agent": config.httpUserAgent } })
			.then(res => res.json())
			.then(json => {
				if (json.length == 0) {
					return message.reply(response(message, "reply", "negative", message.author, { title: "No results were found, or some sort of error occured." }))
				}
				let post = json[Math.floor(Math.random() * json.length)]
				let embed = { color: "ACFF1B", fields: [], image:{} }
				
				embed.footer = {
					"text": `Requested by ${message.author.username}`,
					"icon_url": message.author.avatarURL({ format: "png", size: 256 })
				}
				
				embed.title = "Post #"+post.id+" on rule34.xxx"
				if (post.source) embed.fields.push({ name: "Source", value: post.source})
				embed.fields.push({ name: "Tag(s)", value: trims(post.tags.join(", ")) })
				embed.image.url = post.file_url.replace("https://"+config.rule34Instance+"/images?url=", "")
				embed.url = post.comments_url
				
				if (post.type == "video") {
					embed.fields.push({ name: "Video post", value: "Videos currently don't work in embeds, so the video will be available in a reply to this message." })
					message.reply({ embeds: [embed] })
						.then(sent => {
							sent.reply(post.file_url.replace("https://"+config.rule34Instance+"/images?url=", ""))
						})
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