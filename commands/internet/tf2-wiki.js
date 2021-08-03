const fetch = require("node-fetch")
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const config = require("../../config.json")
const response = require("../../modules/Response.js")
const logger = require("../../modules/Logger.js")
const { validate } = require("../../modules/Utility.js")

module.exports = {
	name: "tf2-wiki",
	description: "Fetches information from the Team Fortress 2 wiki.",
	aliases: ["tf2wiki", "tfwiki", "tf-wiki"],
	category: "internet",
	args: true,
	usage: "(page name)",
	cooldown: 10,
	async execute(message, args, context) {
		// fullArgs is defined here because regular args doesnt include the command itself
		const fullArgs = message.content.trim().split(/ +/)
		let search = validate(message.content.slice(fullArgs[0].length))
		
		if (search == "") { // if only non-alphanumeric characters were provided
			return message.reply(response(message, "reply", "negative", message.author, { title: "That search wouldn't have resulted in anything.\n~~Hint: This usually happens when only non-alphanumeric characters are in the search query.~~" }))
		}
		
		await message.react("👀")
		fetch("https://wiki.teamfortress.com/wiki/"+search, { headers: { "User-Agent": config.httpUserAgent } })
			.then(res => res.text())
			.then(text => {
				const dom = new JSDOM(text)
				
				if (dom.window.document.querySelector("p").textContent.startsWith("There is currently no text in this page.")) {
					return message.reply(response(message, "reply", "negative", message.author, { title: "No results were found." }))
				}
				
				let embed = { color: "f08149", fields: [], author: { name: "Team Fortress 2 Official Wiki" } }
				embed.footer = {
					text: "Requested by "+message.author.username,
					icon_url: message.author.avatarURL({ format: "png", size: 256 })
				}
				let stats = []
				let info = []
				let misc = []
				embed.url = "https://wiki.teamfortress.com/wiki/"+search
				embed.title = dom.window.document.getElementById("firstHeading").textContent
				embed.description = dom.window.document.querySelector("p").textContent
				let url = dom.window.document.querySelector("img").src
				if (url) embed.thumbnail = {url: "http://wiki.teamfortress.com"+url}
				
				// weapon stats
				for (const stat of dom.window.document.getElementsByClassName("att_positive")) {
					if (!stats.includes("✅"+stat.textContent)) {
						stats.push("✅"+stat.textContent)
					}
				}
				for (const stat of dom.window.document.getElementsByClassName("att_negative")) {
					if (!stats.includes("⛔"+stat.textContent)) {
						stats.push("⛔"+stat.textContent)
					}
				}
				for (const stat of dom.window.document.getElementsByClassName("att_neutral")) {
					if (!stats.includes(stat.textContent)) {
						stats.push(stat.textContent)
					}
				}
				if (stats.length > 0) {
					embed.fields.push({ name: "Stats", value: stats.join("\n") })
				}
				
				// get info
				for (const i of dom.window.document.getElementsByClassName("infobox-data")) {
					if (i.textContent.search("Patch") != -1) {
						info.push("**Released: **"+i.textContent)
					}
				}
				
				for (const i of dom.window.document.getElementsByClassName("infobox-label")) {
					if (i.textContent.search("Availability") != -1) {
						info.push("**Availability: **"+i.nextSibling.textContent)
					}
				}
				
				// check tradable status
				if (text.search(`Tradable</span>:</a></td><td class="infobox-data">Yes</td>`) != -1) {
					misc.push("Tradable")
				} else if (text.search(`Tradable</span>:</a></td><td class="infobox-data">No</td>`) != -1) {
					misc.push("Not tradable")
				}
				
				// check nameable status
				if (text.search(`Nameable</span>:</a></td><td class="infobox-data">Yes</td>`) != -1) {
					misc.push("Nameable")
				} else if (text.search(`Nameable</span>:</a></td><td class="infobox-data">No</td>`) != -1) {
					misc.push("Not nameable")
				}
				
				if (misc.length > 0) info.push("`"+misc.join(", ")+"`")
				if (info.length > 0) {
					embed.fields.push({ name: "Additional info", value: info.join("\n") })
				}
				
				message.reply({embeds: [embed]})
		})
		.catch(error => {
			logger.error("Fetch error: "+error)
			message.reply(response(message, "error", "negative", message.author, { 
				description: "Failed to make HTTP request!",
				error: error
			}))
		})
	},
};