const fetch = require("node-fetch")
const response = require("../../modules/Response.js")
const logger = require("../../modules/Logger.js")
var latestComic

// get latest comic number
fetch("https://xkcd.com/info.0.json")
	.then(res => res.json())
	.then(json => {
		latestComic = json.num
	})
	.catch(error => {
		logger.error("Failed to fetch data from xkcd.com. Error: "+error)
	})

module.exports = {
	name: "xkcd",
	description: "Fetches an xkcd.com comic, the latest one, or a random one.",
	aliases: ["xkcdcomic"],
	category: "internet",
	usage: "[comic number or \"latest\"]",
	cooldown: 5,
	async execute(message, args, context) {
		let url
		
		if (args[0]) {
			if (args[0] > latestComic || args[0] < 1) {
				return message.reply(response(message, "reply", "negative", message.author, { 
					title: "That's an invalid comic number!"
				}))
			}
			if (args[0].toLowerCase() == "latest") {
				url = `https://xkcd.com/${latestComic}/info.0.json`
			} else {
				url = `https://xkcd.com/${args[0]}/info.0.json`
			}
		} else {
			let rand = Math.floor(Math.random() * (latestComic - 1) + 1)
			url = `https://xkcd.com/${rand}/info.0.json`
		}
		
		await message.react("👀")
		fetch(url)
			.then(res => res.json())
			.then(json => {
				message.reply(response(message, "urlimage", "positive", message.author, { 
					title: json.title + " - #"+json.num,
					description: json.month + "/" + json.day + "/" + json.year,
					url: json.img
				}))
				.catch(error => {
					message.reply(response(message, "error", "negative", message.author, { 
						description: "Failed to make HTTP request!",
						error: error
					}))
				})
			})
	},
};